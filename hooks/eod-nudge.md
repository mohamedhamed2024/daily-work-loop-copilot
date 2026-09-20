# EOD nudge hook

Remind users to run `/eod-wrap` when they signal end of day without using the command.

## Implementation

| Event | Handler |
|-------|---------|
| `beforeSubmitPrompt` | Prompt hook in [hooks.json](./hooks.json) |

## Trigger

User message suggests finishing work (`done for today`, `logging off`, `EOD`, etc.) without `/eod-wrap`.

## Behavior

**Warn** — may block prompt submit if prompt hook returns ok:false (soft nudge to add `/eod-wrap`).

## User message

> Run `/eod-wrap` to draft Jira updates and list open loops before you stop.

## Test cases

1. "I'm done for today" → nudge.
2. "/eod-wrap please" → no nudge.
