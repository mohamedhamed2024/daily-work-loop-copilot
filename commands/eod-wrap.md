---
name: eod-wrap
description: End-of-day summary with shipped, in progress, and blocked work, draft work-item comments, and open loops.
---

# `/eod-wrap`

Close the day: summarize activity and prepare **draft** work-item updates (Jira comments or GitHub issue comments).

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-eod-wrap/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. `agents/subagent-orchestration.md`

## Subagents (Gather → Draft)

**Gather** (`daily-loop-exploration`) → **Draft** (`daily-loop-execution`).

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--update-tickets` | `draft` | `draft` stays in chat. `approved` posts only after an approval phrase and `.cursor/daily-loop-write-approved` |

## Steps

1. **Gather** — today’s git activity plus stack MCP activity.
2. **Draft** — full EOD template.
3. **Check** (parent) — PASS/FAIL on open loops and draft coverage per [agents/verification.md](../agents/verification.md).
4. If `--update-tickets approved` and the user included `APPROVE_WORK_ITEM_WRITE`, `APPROVE_JIRA_WRITE`, or `APPROVE_GITHUB_WRITE`, create `.cursor/daily-loop-write-approved` and post comments once via the stack MCP. Otherwise keep drafts only. Remove the approval file after the post.

## Safety

- Default: do not post.
- Do not transition issue status or merge PRs.

## Examples

```text
/eod-wrap
/eod-wrap --update-tickets draft
/eod-wrap --update-tickets approved
```

Approved posts also need `APPROVE_WORK_ITEM_WRITE` (or `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE`) in the same message.

## Hook

Running this command with an open-loops table satisfies the session-end reminder. Check still requires owner, next step, and date on every row.
