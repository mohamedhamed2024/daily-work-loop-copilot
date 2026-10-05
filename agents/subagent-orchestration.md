---
name: daily-loop-subagent-orchestration
description: >-
  How to run Daily Work Loop as Gather (exploration) and Draft (execution) Task
  subagents; parent Check for /eod-wrap and /handoff. Load when orchestrating
  daily-loop commands.
---

# Subagent orchestration

Use two Task subagent types: **Gather** and **Draft**. The **parent** summarizes queue commands and runs **Check** after EOD/handoff drafts.

Plain-language overview: [../plugin/how-it-works.md](../plugin/how-it-works.md).

## When to launch

| Command | Task subagents | Parent |
|---------|----------------|--------|
| `/my-queue`, `/next-task` | Gather only | Summarize queue / next-task card |
| `/start-day`, `/daily-status-report` | Gather → Draft | Merge and present |
| `/eod-wrap`, `/handoff` | Gather → Draft | **Check** ([verification.md](./verification.md)) then present |

| Phase | Name | `subagent_type` | Agent file |
|-------|------|-----------------|------------|
| Gather | Load data, rank queue | `daily-loop-exploration` | [exploration.md](./exploration.md) |
| Draft | Format output | `daily-loop-execution` | [execution.md](./execution.md) |
| Check | PASS/FAIL audit | *(parent agent)* | [verification.md](./verification.md) |

Do **not** launch `daily-loop-verification` as a Task. Do not use generic **`explore`** for Jira/GitHub queue builds.

## Gather Task prompt template

```text
Full Repository Path: <absolute path to workspace>

Follow agents/exploration.md in the daily-work-loop-copilot plugin (or workspace copy).

Command: <start-day|my-queue|next-task|eod-wrap|handoff|daily-status-report>
INTEGRATION_STACK: <atlassian|github>
Plugin config: JIRA_PROJECT_KEYS=..., BITBUCKET_WORKSPACE=... OR GITHUB_OWNER/REPO=...
Args: <user flags e.g. --filter=blocked --focus=PROJ-1>

Return: ranked queue JSON + markdown summary + confidence + unlinked list.
Stop when exploration.md stop condition is met.
```

## Draft Task prompt template

```text
Full Repository Path: <path>

Follow agents/execution.md.

Command: <start-day|eod-wrap|handoff|daily-status-report>
Exploration output: <paste Gather result>

Produce output using skills/daily-work-loop/reference/output-templates.md.
Do not post to Jira or GitHub via MCP.
For eod-wrap and handoff, include open loops table (owner, next step, date or TBD).
```

## Check (parent only)

After Draft returns for `/eod-wrap` or `/handoff`:

1. Follow [verification.md](./verification.md).
2. Append `## Verification — PASS | FAIL` to the user-facing response.
3. Do not mark “day closed” or “handoff ready” on FAIL.

## Parent agent duties

1. Load `skills/daily-work-loop/SKILL.md` and the command file.
2. Launch **Gather** (`daily-loop-exploration`) and wait.
3. For `/my-queue` and `/next-task`, summarize from Gather output. Do not launch Draft.
4. For `/start-day`, `/daily-status-report`, `/eod-wrap`, and `/handoff`, launch **Draft** and wait.
5. For `/eod-wrap` and `/handoff`, run **Check** on the Draft output (no third Task).
6. Present the merged response. Create `.cursor/daily-loop-write-approved` and post only when the user sent an approval phrase.

## MCP daily-loop-tools server

External clients: `list_daily_loop_commands`, `get_daily_loop_command`, `get_subagent_prompt` — see [mcp/daily-loop-tools.md](../mcp/daily-loop-tools.md). Phase `verification` in MCP returns the **Check checklist** for the parent, not a Task prompt.
