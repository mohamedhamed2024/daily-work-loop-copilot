# Atlassian MCP — Jira + Bitbucket mapping

Daily Work Loop Copilot uses **Atlassian Rovo MCP** as the system of record for Jira issues and Bitbucket PRs/CI. Server URL: `https://mcp.atlassian.com/v2/mcp`.

Install the official **Atlassian** Cursor plugin and complete **OAuth sign-in** before running daily-loop commands.

Do **not** configure a separate Atlassian API token for this copilot when using that plugin.

## Tool discovery (required after auth)

MCP tool names may change between server versions. Before implementing a workflow:

1. Call `GetDynamicTools` with `namespace: plugin-atlassian-atlassian`.
2. If `namespaceStatus` is `needsAuth`, run `mcp_auth` for that namespace and retry.
3. Map tools by **description** to the abstract operations below; record actual tool names in pilot notes if they differ.

### Abstract → typical capabilities

| Abstract operation | Look for tools that… |
|--------------------|----------------------|
| `get_my_work_items` | Search Jira, run JQL, list issues assigned to current user |
| `get_pull_requests` | List Bitbucket pull requests, filter by author or reviewer |
| `get_pr_comments` | Get PR comments, activities, or diff metadata |
| `get_ci_status` | Pipeline/build status for commit or PR |
| `get_commits` | Bitbucket commits on PR branch (supplement with local `git log`) |
| `update_work_item_comment` | Add Jira comment or update issue (**write** — gated) |
| `get_team_calendar` | Optional; Confluence/calendar — skip if unavailable |

## JQL examples

Replace `KEY1, KEY2` with plugin variable `JIRA_PROJECT_KEYS`.

**My active work**

```jql
assignee = currentUser() AND project IN (KEY1, KEY2) AND status NOT IN (Done, Closed) ORDER BY priority DESC, updated DESC
```

**Blocked**

```jql
assignee = currentUser() AND project IN (KEY1, KEY2) AND status = Blocked
```

**Due soon**

```jql
assignee = currentUser() AND project IN (KEY1, KEY2) AND duedate <= 7d AND status NOT IN (Done, Closed)
```

**Issues linked from keys in commits**

After extracting keys `PROJ-123` from git, fetch:

```jql
key in (PROJ-123, PROJ-456)
```

## Bitbucket patterns

Use plugin variables `BITBUCKET_WORKSPACE` and optional `BITBUCKET_REPO_SLUG`.

- List **open PRs I authored** in workspace/repo.
- List **PRs awaiting my review**.
- For each PR, read **build/pipeline** state; treat `FAILED` or `INPROGRESS` blocking as CI signals for ranking.

If repo slug is omitted, query workspace-level or ask user which repo matches the open workspace folder (`git remote`).

## Local git (always available)

```bash
git branch --show-current
git log --since=midnight --oneline
git log -1 --format=%B
```

Use for commits today, branch keys, and unlinked-work hook checks.

## Jira key linking

Default regex (`JIRA_KEY_PATTERN`): `[A-Z][A-Z0-9]+-\d+`

Extract keys from branch, commits, PR title/body. No key on a new commit or open PR → **unlinked work** warning.

## End-to-end workflow (pilot test)

1. `/start-day` — MCP returns Jira + Bitbucket; queue ranks with confidence **high**.
2. Work locally; commits include `PROJ-123` in message.
3. `/eod-wrap` — draft Jira comment for `PROJ-123` in chat only.
4. User sends `APPROVE_JIRA_WRITE` → agent may call MCP comment tool once.

## Error handling

| Condition | Agent behavior |
|-----------|----------------|
| MCP not authenticated | Explain sign-in; git-only queue; confidence **low** |
| Partial project access | List what was skipped; confidence **medium** |
| Write without approval | Refuse; point to `rules/daily-loop-write-safety.mdc` |
| Tool not found | Fall back to next-best read path; document gap |

## Related

- [security-and-auth.md](./security-and-auth.md)
- Skill: `skills/jira-bitbucket-daily-data/SKILL.md`
