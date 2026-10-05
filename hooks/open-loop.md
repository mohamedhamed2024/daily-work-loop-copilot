# Open loop hook

Advisory reminder at session end to run `/eod-wrap` when the session likely included code or PR activity and the user did not already run it.

## Implementation

| Event | Handler |
|-------|---------|
| `sessionEnd` | Prompt hook in [hooks.json](./hooks.json) |

## Trigger

- Composer session ends (`completed`, `user_close`, `window_close`, etc.).

## Behavior

**Warn** — one sentence, advisory only. Does not block session close. Does not query Jira or GitHub.

Open-loop completeness (owner, next step, and date) is checked in the parent **Check** step when you run `/eod-wrap` or `/handoff` ([verification.md](./verification.md)).

## User message

> Before you go: run `/eod-wrap` to capture draft work-item updates and open loops.

## Test cases

1. Session with commits but no `/eod-wrap` → one-sentence reminder.
2. User already ran `/eod-wrap` → no reminder.

## Related

- `skills/daily-eod-wrap/SKILL.md`
- Verification agent checks open loops on EOD output
