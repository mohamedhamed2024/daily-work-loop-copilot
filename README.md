# Daily Work Loop Copilot

AI-assisted daily workflow: prioritized queue, EOD wrap, and PTO handoff. Supports:

- **`atlassian`** — Jira work items + Bitbucket PRs (Atlassian Cursor plugin)
- **`github`** — GitHub Issues + GitHub PRs (GitHub Cursor plugin)

Set **`INTEGRATION_STACK`** in plugin Configure. See [mcp/integration-stacks.md](./mcp/integration-stacks.md).

## Status

**0.3.0** — Task subagents + MCP command tools. See [PLAN.md](./PLAN.md).

## Install

1. Install **daily-work-loop-copilot** in Cursor.
2. Set **`INTEGRATION_STACK`** and install the matching plugin:
   - `atlassian` → **Atlassian** plugin → Sign in
   - `github` → **GitHub** plugin → Sign in / connect MCP
3. Configure project/repo variables (see [plugin/install.md](./plugin/install.md)).
4. Optional: [`.env.example`](./.env.example) → `.env` local mirror.
5. **Node.js 18+** for bundled `daily-loop-tools` MCP.

Commands run **exploration → execution → (verification)** Task subagents — [agents/subagent-orchestration.md](./agents/subagent-orchestration.md).

Manifest: [.cursor-plugin/plugin.json](./.cursor-plugin/plugin.json).

## Quick reference

| Command | Purpose |
|---|---|
| `/start-day` | Morning brief and top priorities |
| `/my-queue` | Ranked work queue |
| `/next-task` | Single best next action |
| `/eod-wrap` | End-of-day summary and draft issue comments |
| `/handoff [dates]` | PTO / absence handoff pack |
| `/daily-status-report` | Team/project status report (optional Confluence via Atlassian) |

## MCP

Bundled **daily-loop-tools** server exposes commands and subagent prompts. Stack plugins (Atlassian/GitHub) provide live data.

Entry point: [AGENTS.md](./AGENTS.md).

## Safety

Draft-only work-item writes until `APPROVE_WORK_ITEM_WRITE` + `.cursor/daily-loop-write-approved`. No auto-merge.
