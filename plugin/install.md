# Install — Daily Work Loop Copilot

## Prerequisites

- Cursor with Plugins support
- One primary stack: **Atlassian** (Jira + Bitbucket) **or** **GitHub** (Issues + PRs)

See [mcp/integration-stacks.md](../mcp/integration-stacks.md).

## 1. MCP plugin for your stack

### Atlassian (`INTEGRATION_STACK=atlassian`)

1. Install **Atlassian** Cursor plugin → **Sign in** (OAuth).
2. Verify `plugin-atlassian-atlassian` tools in Agent.

### GitHub (`INTEGRATION_STACK=github`)

1. Install **GitHub** Cursor plugin → connect / **Sign in** to GitHub MCP.
2. Verify `plugin-github-github` tools (e.g. `get_me`, `list_issues`, `list_pull_requests`).

No API tokens in `.env` for either path when using official Cursor plugins.

## 2. Daily Work Loop plugin

1. Install this repo as a Cursor plugin (path or marketplace).
2. Confirm [.cursor-plugin/plugin.json](../.cursor-plugin/plugin.json) loads skills, commands, hooks, rules, and **mcp.json** (`daily-loop-tools` server).
3. **Node.js 18+** required for bundled MCP tools (auto `npm install` on first run in `scripts/daily-loop-mcp/`).

## 3. Configure

Plugins → **daily-work-loop-copilot** → **Configure**:

| Variable | Atlassian example | GitHub example |
|----------|-------------------|----------------|
| `INTEGRATION_STACK` | `atlassian` | `github` |
| `JIRA_PROJECT_KEYS` | `PROJ,ENG` | — |
| `BITBUCKET_WORKSPACE` | `my-workspace` | — |
| `GITHUB_OWNER` | — | `my-org` |
| `GITHUB_REPO` | — | `my-service` |
| `STALE_REVIEW_DAYS` | `2` | `2` |

Optional: [`.env.example`](../.env.example) → `.env` — [config/env.md](../config/env.md).

## 4. Pilot application repo

1. Match remote to stack (Bitbucket vs GitHub).
2. Add snippet to repo `AGENTS.md`:

   ```markdown
   ## Daily work loop
   INTEGRATION_STACK=<atlassian|github>. Commands: `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`, `/daily-status-report`.
   Uses Task subagents (exploration → execution → verification). MCP: daily-loop-tools + stack plugin.
   ```

3. Same MCP plugin signed in for that Cursor user.

## Verify hooks

Settings → Hooks — no schema errors. Write gate: [hooks/jira-write-gate.md](../hooks/jira-write-gate.md).

## Next step

[tests/clean-install-and-e2e.md](../tests/clean-install-and-e2e.md)
