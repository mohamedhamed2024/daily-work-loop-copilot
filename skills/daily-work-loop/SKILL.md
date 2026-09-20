---
name: daily-work-loop
description: >-
  Orchestrates the daily engineering loop via Task subagents (exploration,
  execution, verification). Jira+Bitbucket or GitHub Issues+PRs. MCP tools
  list commands and status-report plans.
---

# Daily Work Loop (orchestrator)

## When to use

- `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`, `/daily-status-report`
- User asks for morning planning, queue, EOD, handoff, or **daily status report**

## Subagents (required)

Follow [agents/subagent-orchestration.md](../../agents/subagent-orchestration.md):

1. **Task → exploration** (`agents/exploration.md`) — MCP + git data, ranked queue.
2. **Task → execution** (`agents/execution.md`) — user-facing drafts.
3. **Task → verification** (`agents/verification.md`) — for `eod-wrap`, `handoff`, `daily-status-report`.

Use `subagent_type: generalPurpose`. Parent agent merges results; do not skip exploration for full commands.

Optional: call MCP tool `get_subagent_prompt` from **daily-loop-tools** server to build Task prompts.

## Integration stack

Read **`INTEGRATION_STACK`**. See [mcp/integration-stacks.md](../../mcp/integration-stacks.md).

| Stack | Data skill | Live data MCP |
|-------|------------|---------------|
| `atlassian` | `skills/jira-bitbucket-daily-data/SKILL.md` | `plugin-atlassian-atlassian` |
| `github` | `skills/github-daily-data/SKILL.md` | `plugin-github-github` |

## Plugin MCP (commands & plans)

Server **daily-loop-tools** ([mcp/daily-loop-tools.md](../../mcp/daily-loop-tools.md)):

- `list_daily_loop_commands` / `get_daily_loop_command`
- `get_subagent_prompt`
- `plan_daily_status_report`

Read-only; does not replace Atlassian/GitHub MCP.

## Focused skills

| Skill | Path |
|-------|------|
| Queue ranking | `skills/work-queue-ranking/SKILL.md` |
| EOD | `skills/daily-eod-wrap/SKILL.md` |
| Handoff | `skills/daily-handoff/SKILL.md` |
| Status report | `skills/daily-status-report/SKILL.md` |

## Global constraints

1. Read-first on stack MCP.
2. No auto-close / auto-merge.
3. Writes: `APPROVE_WORK_ITEM_WRITE` + `.cursor/daily-loop-write-approved`.
4. Linking: `rules/work-item-linking.mdc`.

## Flow index

| Command | Subagents |
|---------|-----------|
| start-day, my-queue, next-task | exploration → execution |
| eod-wrap, handoff, daily-status-report | exploration → execution → verification |

## Output

Templates: [reference/output-templates.md](./reference/output-templates.md). State **confidence** from exploration.
