#!/usr/bin/env bash
# Seed or remove GitHub pilot fixtures for Daily Work Loop E2E (GitHub stack).
# Default target: mohamedhamed2024/MyHoppiesRootRepo
#
# Usage:
#   ./tests/scripts/seed-github-pilot-fixtures.sh [--dry-run] [--cleanup] [--push]
#
# Requires: gh, git; gh auth as repo owner.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
FIXTURE_CI="${PLUGIN_ROOT}/tests/fixtures/dwl-pilot-fail-ci.yml"

GITHUB_OWNER="${GITHUB_OWNER:-mohamedhamed2024}"
GITHUB_REPO="${GITHUB_REPO:-MyHoppiesRootRepo}"
REPO_SLUG="${GITHUB_OWNER}/${GITHUB_REPO}"
PILOT_LABEL="dwl-pilot"
DRY_RUN=0
CLEANUP=0
PUSH=0

APP_REPO="${APP_REPO:-}"

usage() {
  sed -n '2,8p' "$0"
  echo "Env: GITHUB_OWNER, GITHUB_REPO, APP_REPO (local clone path)"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --cleanup) CLEANUP=1 ;;
    --push) PUSH=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
  shift
done

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI required" >&2
  exit 1
fi

gh_api() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[dry-run] gh $*"
    return 0
  fi
  gh "$@"
}

find_app_repo() {
  if [[ -n "$APP_REPO" && -d "$APP_REPO/.git" ]]; then
    echo "$APP_REPO"
    return
  fi
  local candidates=(
    "${PLUGIN_ROOT}/../MyHoppiesRootRepo"
    "${HOME}/Desktop/AI Ideas/MyHoppiesRootRepo"
  )
  local c
  for c in "${candidates[@]}"; do
    if [[ -d "$c/.git" ]]; then
      echo "$c"
      return
    fi
  done
  echo ""
}

cleanup_fixtures() {
  echo "Cleaning up ${REPO_SLUG} fixtures (label: ${PILOT_LABEL})..."
  local prs
  prs="$(gh_api pr list --repo "$REPO_SLUG" --state all --limit 100 --json number,headRefName \
    --jq '.[] | select(.headRefName | test("dwl-pilot")) | .number' 2>/dev/null || true)"
  local n
  for n in $prs; do
    [[ -z "$n" ]] && continue
    gh_api pr close "$n" --repo "$REPO_SLUG" --delete-branch 2>/dev/null || gh_api pr close "$n" --repo "$REPO_SLUG" || true
  done

  local issues
  issues="$(gh_api issue list --repo "$REPO_SLUG" --state all --limit 100 --label "$PILOT_LABEL" --json number \
    --jq '.[].number' 2>/dev/null || true)"
  local i
  for i in $issues; do
    [[ -z "$i" ]] && continue
    gh_api issue close "$i" --repo "$REPO_SLUG" --comment "dwl-pilot cleanup" 2>/dev/null || gh_api issue close "$i" --repo "$REPO_SLUG" || true
  done

  local app
  app="$(find_app_repo)"
  if [[ -n "$app" ]]; then
    git -C "$app" fetch origin 2>/dev/null || true
    for br in dwl-pilot/linked dwl-pilot/fail-ci dwl-pilot/unlinked; do
      git -C "$app" branch -D "$br" 2>/dev/null || true
      if [[ "$PUSH" -eq 1 && "$DRY_RUN" -eq 0 ]]; then
        git -C "$app" push origin --delete "$br" 2>/dev/null || true
      fi
    done
  fi
  echo "Cleanup done."
}

seed_fixtures() {
  local me
  me="$(gh_api api user --jq .login 2>/dev/null || echo "$GITHUB_OWNER")"
  echo "Seeding ${REPO_SLUG} as ${me}..."

  local body_suffix=$'\n\n---\n`dwl-pilot` fixture for Daily Work Loop Copilot E2E.'

  local issue_progress issue_blocked issue_done
  if [[ "$DRY_RUN" -eq 1 ]]; then
    issue_progress=101
    issue_blocked=102
    issue_done=103
    echo "[dry-run] would create 3 issues and 2 PRs"
  else
    gh label create "$PILOT_LABEL" --repo "$REPO_SLUG" --color "FEF2C0" --description "Daily Work Loop pilot" 2>/dev/null || true

    issue_progress="$(gh issue create --repo "$REPO_SLUG" \
      --title "[dwl-pilot] In progress — queue ranking" \
      --body "Assigned in-progress work for /my-queue and /next-task.${body_suffix}" \
      --label "$PILOT_LABEL" \
      --assignee "$me" | sed -n 's|.*/issues/\([0-9]*\).*|\1|p')"

    issue_blocked="$(gh issue create --repo "$REPO_SLUG" \
      --title "[dwl-pilot] Blocked — waiting on review" \
      --body "Blocked item for --filter=blocked and status report.${body_suffix}" \
      --label "$PILOT_LABEL" \
      --assignee "$me" | sed -n 's|.*/issues/\([0-9]*\).*|\1|p')"

    issue_done="$(gh issue create --repo "$REPO_SLUG" \
      --title "[dwl-pilot] Done — status report completed" \
      --body "Close after create for status-report window.${body_suffix}" \
      --label "$PILOT_LABEL" \
      --assignee "$me" | sed -n 's|.*/issues/\([0-9]*\).*|\1|p')"

    gh issue close "$issue_done" --repo "$REPO_SLUG" --comment "Completed in pilot seed." || true
  fi

  local app
  app="$(find_app_repo)"
  if [[ -z "$app" ]]; then
    echo "Warning: no local clone of ${REPO_SLUG}. PR branches skipped." >&2
    echo "Set APP_REPO=/path/to/MyHoppiesRootRepo and re-run with --push"
    print_map "$issue_progress" "$issue_blocked" "$issue_done" "" ""
    return
  fi

  echo "Using app repo: $app"
  git -C "$app" checkout main 2>/dev/null || git -C "$app" checkout master 2>/dev/null || true
  git -C "$app" pull --ff-only 2>/dev/null || true

  mkdir -p "$app/.github/workflows"
  if [[ "$DRY_RUN" -eq 0 ]]; then
    cp "$FIXTURE_CI" "$app/.github/workflows/dwl-pilot-fail-ci.yml"
    git -C "$app" add .github/workflows/dwl-pilot-fail-ci.yml
    git -C "$app" commit -m "chore(dwl-pilot): add fail-ci workflow for Daily Work Loop tests" \
      --allow-empty 2>/dev/null || git -C "$app" commit -m "chore(dwl-pilot): add fail-ci workflow for Daily Work Loop tests" || true
    if [[ "$PUSH" -eq 1 ]]; then
      git -C "$app" push origin HEAD
    fi
  else
    echo "[dry-run] would copy fail-ci workflow to $app"
  fi

  local pr_linked="" pr_fail=""
  seed_branch_pr() {
    local branch="$1"
    local title="$2"
    local pr_body="$3"
    if [[ "$DRY_RUN" -eq 1 ]]; then
      echo "[dry-run] branch $branch + PR"
      return
    fi
    git -C "$app" checkout -B "$branch" 2>/dev/null || git -C "$app" checkout "$branch"
    mkdir -p "$app/.dwl-pilot"
    date -u +%Y-%m-%dT%H:%MZ > "$app/.dwl-pilot/${branch//\//-}.txt"
    git -C "$app" add .dwl-pilot
    git -C "$app" commit -m "${title} (${branch})" --allow-empty || git -C "$app" commit -m "${title} (${branch})" || true
    if [[ "$PUSH" -eq 1 ]]; then
      git -C "$app" push -u origin "$branch" --force
    else
      echo "Note: PR for $branch needs --push to publish branch to GitHub." >&2
      return
    fi
    gh pr create --repo "$REPO_SLUG" --head "$branch" --base main \
      --title "$title" --body "$pr_body" 2>/dev/null | sed -n 's|.*/pull/\([0-9]*\).*|\1|p' || \
    gh pr create --repo "$REPO_SLUG" --head "$branch" --base master \
      --title "$title" --body "$pr_body" 2>/dev/null | sed -n 's|.*/pull/\([0-9]*\).*|\1|p'
  }

  if [[ "$PUSH" -eq 1 || "$DRY_RUN" -eq 1 ]]; then
    pr_linked="$(seed_branch_pr "dwl-pilot/linked" \
      "[dwl-pilot] Linked PR waiting review" \
      "Fixes #${issue_progress}${body_suffix}")" || pr_linked=""
    pr_fail="$(seed_branch_pr "dwl-pilot/fail-ci" \
      "[dwl-pilot] PR with failing CI" \
      "Triggers dwl-pilot-fail-ci workflow.${body_suffix}")" || pr_fail=""
  fi

  git -C "$app" checkout main 2>/dev/null || git -C "$app" checkout master 2>/dev/null || true

  print_map "$issue_progress" "$issue_blocked" "$issue_done" "$pr_linked" "$pr_fail"
}

print_map() {
  cat <<EOF

=== Daily Work Loop pilot fixture map ===
Repo: ${REPO_SLUG}
In-progress issue:  #${1:-?}
Blocked issue:      #${2:-?}
Closed issue:       #${3:-?}
Linked PR:          #${4:-?} (needs --push if empty)
Fail-CI PR:         #${5:-?} (needs --push if empty)

Paste into tests/github-pilot-e2e.md or keep for /start-day --focus=#N

Next: open ${REPO_SLUG} in Cursor, INTEGRATION_STACK=github, run Act 1 in tests/github-pilot-e2e.md
EOF
}

if [[ "$CLEANUP" -eq 1 ]]; then
  cleanup_fixtures
  exit 0
fi

seed_fixtures
