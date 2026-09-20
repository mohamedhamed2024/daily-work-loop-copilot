# Daily loop context hook

Light reminder to load orchestrator skill when daily commands are used.

## Implementation

| Event | Handler |
|-------|---------|
| `sessionStart` | First prompt hook in [hooks.json](./hooks.json) |

## Trigger

Session start (low noise).

## Behavior

**Advisory** — orients agent to load `skills/daily-work-loop/SKILL.md` when user invokes daily-loop commands.

## Test cases

1. Session start → agent policy only; no user-visible banner required.

## Related

- [AGENTS.md](../AGENTS.md)
