# Open loop hook

Warn before session end if work may be left undocumented (activity without EOD capture or loops without owner/next step).

## Implementation

| Event | Handler |
|-------|---------|
| `sessionEnd` | Prompt hook in [hooks.json](./hooks.json) |

## Trigger

- Composer session ends (`completed`, `user_close`, `window_close`, etc.).

## Behavior

**Warn** — advisory only; does not block session close.

## User message

> Before you go: run `/eod-wrap` to capture draft Jira updates and open loops.

## Test cases

1. Session with commits but no `/eod-wrap` → one-sentence reminder.
2. User ran `/eod-wrap` with complete open-loop table → minimal or no reminder.

## Related

- `skills/daily-eod-wrap/SKILL.md`
- Verification agent checks open loops on EOD output
