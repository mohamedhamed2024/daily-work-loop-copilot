---
name: daily-work-loop
description: >-
  Orchestrates the daily engineering loop: Gather and Draft Task subagents;
  parent Check on EOD/handoff. Jira+Bitbucket or GitHub Issues+PRs.
---

# Daily Work Loop (orchestrator)

Plain language: [plugin/how-it-works.md](../../plugin/how-it-works.md).

## When to use

- `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`, `/daily-status-report`
- User asks for morning planning, queue, EOD, handoff, or **daily status report**

## Gather → Draft → Check

Follow [agents/subagent-orchestration.md](../../agents/subagent-orchestration.md).

| Command | Task subagents | Parent |
|---------|----------------|--------|
| `/my-queue`, `/next-task` | Gather only | Summarize queue / next task |
| `/start-day`, `/daily-status-report` | Gather → Draft | Present merged output |
| `/eod-wrap`, `/handoff` | Gather → Draft | **Check** then present |

Registered types: `daily-loop-exploration` (Gather), `daily-loop-execution` (Draft). Check uses [agents/verification.md](../../agents/verification.md) — no third Task.

Optional: MCP `get_subagent_prompt` on **daily-loop-tools** for external clients.

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
3. Writes: user approval phrase, then `.cursor/daily-loop-write-approved` (write lock hook checks the file).
4. Linking: [rules/daily-loop-policy.mdc](../../rules/daily-loop-policy.mdc).

## Output

Templates: [reference/output-templates.md](./reference/output-templates.md). State **confidence** from Gather.
