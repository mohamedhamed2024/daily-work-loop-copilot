---
name: github-daily-data
description: >-
  Fetches daily-loop data from GitHub MCP (Issues + PRs + checks) and local git.
  Use when INTEGRATION_STACK=github or the repo remote is github.com.
---

# GitHub Issues + PRs daily data

## Prerequisites

- **GitHub** Cursor plugin / MCP authenticated (`plugin-github-github` namespace).
- Plugin variables: `INTEGRATION_STACK=github`, `GITHUB_OWNER`, `GITHUB_REPO` (or infer `owner/repo` from `git remote get-url origin`).
- Optional: `GITHUB_ISSUE_LINK_PATTERN` (default detects `#123`, `Fixes #123`, `owner/repo#123`).

See [mcp/github-issues-prs.md](../../mcp/github-issues-prs.md).

## Data gathering order

1. **Discover MCP tools** — `GetDynamicTools` on `plugin-github-github`; call `get_me` if needed for current user login.
2. **Issues assigned to me** — `list_issues` / `search_issues` with `assignee:@me` and `repo:OWNER/REPO state:open`.
3. **Pull requests** — `list_pull_requests` or `search_pull_requests`: open PRs authored by me; PRs requesting my review.
4. **CI / checks** — From PR payload (check runs, combined status) via `pull_request_read` or check APIs exposed in MCP.
5. **Local git** — Same as Atlassian path (`git log --since=midnight`, branch name).

## Issue linking (GitHub)

Detect references in branch, commits, PR title/body:

- `#123` or `Fixes #123` / `Closes #123` / `Refs #123`
- Optional full form: `owner/repo#123` when working across forks

**Unlinked:** commit or open PR with no issue reference → unlinked-work hook.

## Abstract tool mapping

| Need | GitHub MCP (typical) |
|------|----------------------|
| My issues | `list_issues`, `search_issues` |
| PRs + reviews | `list_pull_requests`, `search_pull_requests`, `pull_request_read` |
| PR comments | `pull_request_read`, review comment tools |
| CI status | PR checks / status from `pull_request_read` |
| Commits today | Local `git log` |
| Issue comment write | `issue_write`, `add_issue_comment` — **gated** |
| Merge PR | **Never** automated in MVP |

## Writes

Never call GitHub issue/PR mutation tools unless the user included `APPROVE_WORK_ITEM_WRITE` or `APPROVE_GITHUB_WRITE` (and approval file exists). Default: draft comment in chat.

## Errors

- **needsAuth:** Connect GitHub in Cursor MCP settings; continue git-only with low confidence.
- Wrong repo: resolve `GITHUB_OWNER`/`GITHUB_REPO` from remote before querying.
