---
name: jira-bitbucket-daily-data
description: >-
  Fetches daily-loop data from Atlassian Rovo MCP (Jira + Bitbucket) and local git.
  Use when building a queue, checking links, EOD activity, or hook guardrails need
  issue/PR/CI context.
---

# Jira + Bitbucket daily data

## Prerequisites

- Plugin variable **`INTEGRATION_STACK=atlassian`** (default).
- Atlassian Rovo MCP authenticated via **Atlassian Cursor plugin** (OAuth).
- Plugin variables or [`.env.example`](../../.env.example): `JIRA_PROJECT_KEYS`, `BITBUCKET_WORKSPACE`, optional `BITBUCKET_REPO_SLUG`. **Auth:** Atlassian plugin OAuth only ([config/env.md](../../config/env.md)).

See [mcp/atlassian-bitbucket-jira.md](../../mcp/atlassian-bitbucket-jira.md) for tool discovery and JQL patterns.

## Data gathering order

1. **Discover MCP tools** — `GetDynamicTools` on namespace `plugin-atlassian-atlassian` after auth; prefer read/search tools whose names or descriptions mention Jira, Bitbucket, issue, pull request, pipeline, or comment.
2. **Jira — my work** — JQL example (adjust assignee and projects):

   ```text
   assignee = currentUser() AND project IN (KEY1, KEY2) AND status NOT IN (Done, Closed) ORDER BY updated DESC
   ```

3. **Bitbucket — PRs** — Open PRs authored by user; PRs awaiting user’s review in `BITBUCKET_WORKSPACE` / repo.
4. **CI / pipelines** — Failing or pending checks on those PRs (from PR payload or pipeline tools).
5. **Local git** — Today’s commits (workspace):

   ```bash
   git log --since=midnight --author="$(git config user.email)" --oneline
   ```

   Also scan current branch name for Jira keys.

## Jira key linking

Regex from plugin variable `JIRA_KEY_PATTERN` (default `[A-Z][A-Z0-9]+-\d+`). Scan:

- Branch name (`git branch --show-current`)
- Commit messages since last EOD or since midnight
- PR title and description (from MCP)

**Unlinked:** commit or open PR with no matching key → flag for unlinked-work hook.

## Abstract tool mapping

| Need | Source |
|------|--------|
| My Jira issues | MCP Jira search / JQL |
| PRs + reviews | MCP Bitbucket |
| PR comments / review state | MCP Bitbucket |
| CI status | MCP pipelines or PR status fields |
| Commits today | Local `git log` (+ MCP if needed) |
| Jira comment write | MCP **only** with user `APPROVE_JIRA_WRITE` |
| Calendar | Optional; skip if MCP unavailable |

## Errors

- **needsAuth:** Ask user to complete Atlassian plugin sign-in; continue with git-only + lower confidence.
- **403/404:** Note missing scope or wrong workspace/repo; do not fabricate data.
- **Rate limits:** Batch requests; summarize partial results.

## Writes

Never call Jira create/update/comment tools unless the user included `APPROVE_JIRA_WRITE` in the current request. Default: produce draft comment text in chat.
