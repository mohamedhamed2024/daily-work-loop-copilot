---
name: eod-wrap
description: End-of-day summary with shipped/in-progress/blocked, draft Jira comments, and open loops.
---

# `/eod-wrap`

Close the day: summarize activity and prepare **draft** Jira updates.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-eod-wrap/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. Rule: `rules/eod-update-expectations.mdc`
5. `agents/subagent-orchestration.md`

## Subagents (required)

**Task exploration** → **Task execution** → **Task verification**.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--update-tickets` | `draft` | `draft` = chat only; `approved` requires `APPROVE_JIRA_WRITE` for MCP posts |

## Steps

1. **Exploration** subagent — today’s git + stack MCP activity.
2. **Execution** subagent — full EOD template.
3. **Verification** subagent — PASS/FAIL on open loops and draft coverage.
4. If `--update-tickets approved` **and** user included `APPROVE_JIRA_WRITE`, post comments via Atlassian MCP once; else keep drafts only.

## Safety

- Default: **never** post to Jira.
- Do not transition issue status or merge PRs.

## Examples

```text
/eod-wrap
/eod-wrap --update-tickets draft
/eod-wrap --update-tickets approved
```

(User must also say `APPROVE_JIRA_WRITE` in the same message for approved posts.)

## Hook

Running this command satisfies **open-loop** expectations for the session when output includes open loops table.
