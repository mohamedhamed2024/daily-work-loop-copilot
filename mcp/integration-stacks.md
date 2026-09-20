# Integration stacks

Daily Work Loop Copilot supports **one primary stack** per workspace, selected by plugin variable **`INTEGRATION_STACK`**.

| Value | Work items | Code review / CI | MCP namespace | Cursor plugin |
|-------|------------|------------------|---------------|---------------|
| **`atlassian`** (default) | Jira | Bitbucket PRs + pipelines | `plugin-atlassian-atlassian` | Atlassian |
| **`github`** | GitHub Issues | GitHub PRs + checks | `plugin-github-github` | GitHub |

## Choosing a stack

- Bitbucket remote + Jira board → **`atlassian`**
- GitHub remote + GitHub Issues → **`github`**
- Mixed org (Jira + GitHub code): pick the system of record for **work items**; document exceptions in team `AGENTS.md`. MVP does not merge two MCP stacks into one ranked queue automatically.

## Configure

Plugins → **daily-work-loop-copilot** → **Configure**:

**Atlassian**

- `INTEGRATION_STACK=atlassian`
- `JIRA_PROJECT_KEYS`, `BITBUCKET_WORKSPACE`, optional `BITBUCKET_REPO_SLUG`

**GitHub**

- `INTEGRATION_STACK=github`
- `GITHUB_OWNER`, `GITHUB_REPO` (e.g. `my-org`, `my-service`)

Shared: `STALE_REVIEW_DAYS`, linking patterns (`JIRA_KEY_PATTERN` or GitHub `#` refs).

## Agent behavior

1. Read `INTEGRATION_STACK` from plugin Configure (default `atlassian`).
2. Load data skill:
   - `atlassian` → [skills/jira-bitbucket-daily-data/SKILL.md](../skills/jira-bitbucket-daily-data/SKILL.md)
   - `github` → [skills/github-daily-data/SKILL.md](../skills/github-daily-data/SKILL.md)
3. Use matching MCP doc under [mcp/](./).

## Bundled MCP: daily-loop-tools

[mcp.json](../mcp.json) registers **daily-loop-tools** (Node.js): list/get commands, subagent prompts, `plan_daily_status_report`. See [daily-loop-tools.md](./daily-loop-tools.md). Live Jira/GitHub data still comes from stack plugins.
