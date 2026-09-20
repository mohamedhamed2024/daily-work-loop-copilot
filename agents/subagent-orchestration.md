---
name: daily-loop-subagent-orchestration
description: >-
  How to run Daily Work Loop phases as Cursor Task subagents (exploration,
  execution, verification). Load when orchestrating /start-day, queue, EOD, handoff,
  or status report flows.
---

# Subagent orchestration

Use **Task subagents** for each phase. Do not skip phases by doing all work in the parent agent unless the user explicitly asks for a quick answer.

## Subagent mapping

| Phase | Agent file | When |
|-------|------------|------|
| Exploration | [exploration.md](./exploration.md) | start-day, my-queue, next-task, handoff prep, status report data |
| Execution | [execution.md](./execution.md) | All user-facing drafts |
| Verification | [verification.md](./verification.md) | eod-wrap, handoff, optional status report |

Recommended `subagent_type`: **`generalPurpose`** (MCP + git + multi-step). Use **`explore`** only for codebase-only lookups, not for Jira/GitHub queue builds.

## Exploration Task prompt template

```text
Full Repository Path: <absolute path to workspace>

Follow agents/exploration.md in the daily-work-loop-copilot plugin (or workspace copy).

Command: <start-day|my-queue|next-task|handoff|daily-status-report>
INTEGRATION_STACK: <atlassian|github>
Plugin config: JIRA_PROJECT_KEYS=..., BITBUCKET_WORKSPACE=... OR GITHUB_OWNER/REPO=...
Args: <user flags e.g. --filter=blocked --focus=PROJ-1>

Return: ranked queue JSON + markdown summary + confidence + unlinked list.
Stop when exploration.md stop condition is met.
```

## Execution Task prompt template

```text
Full Repository Path: <path>

Follow agents/execution.md.

Command: <...>
Exploration output: <paste exploration result>

Produce output using skills/daily-work-loop/reference/output-templates.md.
Do not post to Jira/GitHub via MCP.
```

## Verification Task prompt template

```text
Full Repository Path: <path>

Follow agents/verification.md.

Command: <eod-wrap|handoff|daily-status-report>
Draft output: <paste execution result>

Return PASS/FAIL with required fixes only.
```

## Parent agent duties

1. Load `skills/daily-work-loop/SKILL.md` and the command file.
2. Launch exploration Task → wait.
3. Launch execution Task → wait.
4. Launch verification Task when required → wait.
5. Present final merged response to user; apply write-approval rules in parent only if user approved posting.

## MCP daily-loop-tools server

External MCP clients can call plugin tools (`list_daily_loop_commands`, `get_daily_loop_command`, `get_subagent_prompt`) — see [mcp/daily-loop-tools.md](../mcp/daily-loop-tools.md).
