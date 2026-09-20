# Environment variables

Use [`.env.example`](../.env.example) as an optional local mirror. Copy to `.env` (gitignored):

```bash
cp .env.example .env
```

## Integration stack

| `INTEGRATION_STACK` | Work items | PRs / CI | Cursor plugin | MCP namespace |
|---------------------|------------|----------|---------------|---------------|
| **`atlassian`** (default) | Jira | Bitbucket | Atlassian | `plugin-atlassian-atlassian` |
| **`github`** | GitHub Issues | GitHub PRs | GitHub | `plugin-github-github` |

Details: [mcp/integration-stacks.md](../mcp/integration-stacks.md).

## Authentication

| Stack | Action |
|-------|--------|
| Atlassian | Plugins → **Atlassian** → Sign in (OAuth). No API token in `.env`. |
| GitHub | Plugins → **GitHub** → Sign in / connect MCP. No PAT in `.env` for typical Cursor use. |

## Variable reference

| Variable | When required |
|----------|----------------|
| `INTEGRATION_STACK` | Always (default `atlassian`) |
| `JIRA_PROJECT_KEYS`, `BITBUCKET_WORKSPACE` | `atlassian` |
| `GITHUB_OWNER`, `GITHUB_REPO` | `github` |
| `STALE_REVIEW_DAYS`, linking patterns | Both |
| `ATLASSIAN_SITE_URL` | Optional (Atlassian links) |

Set values in **Plugins → daily-work-loop-copilot → Configure** (Cursor does not auto-load `.env` for Agent).

### Write approval (both stacks)

| Variable / file | Purpose |
|-----------------|--------|
| `APPROVE_WORK_ITEM_WRITE` / `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE` | User consent in chat |
| `.cursor/daily-loop-write-approved` | Approval file in app repo |
| `DAILY_LOOP_JIRA_WRITE_APPROVED=1` | Dev-only hook bypass |

See [mcp/security-and-auth.md](../mcp/security-and-auth.md).
