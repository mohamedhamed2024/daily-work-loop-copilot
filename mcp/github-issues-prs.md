# GitHub MCP — Issues + PRs mapping

Use when plugin variable **`INTEGRATION_STACK=github`** (or the pilot repo’s primary remote is GitHub).

## Authentication

- Install and authenticate the **GitHub** Cursor plugin / MCP server.
- Namespace: **`plugin-github-github`**
- Call `get_me` to confirm the session and login name for assignee/reviewer filters.

No token in this repo’s `.env` is required when GitHub OAuth is handled by Cursor.

## Tool discovery

1. `GetDynamicTools` with `namespace: plugin-github-github`.
2. If `needsAuth`, complete GitHub MCP sign-in and retry.
3. Prefer tools by name/description: `issue`, `pull_request`, `search`, `list`, `comment`.

### Abstract → typical GitHub MCP tools

| Abstract operation | Typical approach |
|--------------------|------------------|
| `get_my_work_items` | `list_issues` or `search_issues` — `assignee:@me`, `repo:OWNER/REPO`, `state:open` |
| `get_pull_requests` | `list_pull_requests` — `owner`, `repo`, `state=open`; filter author or review-requested |
| `get_pr_comments` | `pull_request_read` with comments/reviews fields |
| `get_ci_status` | Check runs / status from PR read or dedicated check tools |
| `get_commits` | Local `git log` (+ optional `list_commits` / PR commits via MCP) |
| `update_work_item_comment` | `add_issue_comment` / `issue_write` — **write gate** |
| `get_team_calendar` | Not in MVP — skip |

## Search examples

**My open issues in one repo**

```text
repo:my-org/my-service is:open assignee:@me
```

**PRs waiting on my review**

```text
repo:my-org/my-service is:open review-requested:@me
```

**PRs I authored**

```text
repo:my-org/my-service is:open author:@me
```

Replace `my-org/my-service` with `GITHUB_OWNER/GITHUB_REPO` or parse from `git remote`.

## Linking commits and PRs to issues

Default patterns (override with `GITHUB_ISSUE_LINK_PATTERN` if needed):

- `#42` in commit or PR title
- `Fixes #42`, `Closes #42`, `Refs #42` in commit body
- Branch names like `42-fix-login` or `issue-42` (optional team convention)

## End-to-end workflow (pilot)

1. Set `INTEGRATION_STACK=github`, `GITHUB_OWNER`, `GITHUB_REPO`.
2. `/start-day` — issues + PRs from GitHub MCP; queue confidence **high**.
3. Commit with `Fixes #12` in message.
4. `/eod-wrap` — draft **issue comment** in chat (not posted until approved).

## Write approval

Same as Atlassian path:

- User says `APPROVE_WORK_ITEM_WRITE` or `APPROVE_GITHUB_WRITE`
- `.cursor/daily-loop-write-approved` in the **application repo**
- [hooks/scripts/jira-write-gate.sh](../hooks/scripts/jira-write-gate.sh) allows GitHub mutation tools

## Related

- Skill: [skills/github-daily-data/SKILL.md](../skills/github-daily-data/SKILL.md)
- Stack selection: [config/env.md](../config/env.md)
- Atlassian path: [atlassian-bitbucket-jira.md](./atlassian-bitbucket-jira.md)
