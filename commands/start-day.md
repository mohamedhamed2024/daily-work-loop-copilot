---
name: start-day
description: Morning brief with blockers, top three priorities, and suggested first action from Jira and Bitbucket.
---

# `/start-day`

Morning planning: one brief view of meetings (if available), blockers, top priorities, and the first action to take.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/jira-bitbucket-daily-data/SKILL.md`
3. `skills/work-queue-ranking/SKILL.md`
4. Optional rule: `rules/standup-format.mdc`
5. Stack data skill per `INTEGRATION_STACK` (jira-bitbucket or github)
6. `agents/subagent-orchestration.md`

## Subagents (required)

1. **Task (exploration)** — `agents/exploration.md`; optional MCP `get_subagent_prompt(phase=exploration)`.
2. **Task (execution)** — `agents/execution.md` with exploration output.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--standup` | off | Include optional standup draft block |
| `--focus=KEY` | none | Boost one Jira key in ranking |

## Steps

1. Launch **exploration** subagent (not inline MCP in parent only).
2. Take top 3 from exploration result with `why_now`.
3. Identify **blockers** from queue items with blocked signals or Jira Blocked status.
4. **Calendar:** optional MCP; if unavailable, state “Calendar not available”.
5. Launch **execution** subagent for morning brief template.
6. **Suggested first action:** highest-ranked *actionable* item (prefer unblockers: reviews blocking your Jira, failing CI on your PR).

## Safety

- Read-only MCP for this command.
- Do not post Jira comments.

## Example

```text
/start-day
/start-day --standup
/start-day --focus=PROJ-8842
```

## Example output (abbreviated)

```markdown
## Morning brief — 2026-09-19
**Blockers:** PROJ-8842 blocked on PR review #412
**Top 3:** …
**Suggested first action:** Review PR #412 (unblocks PROJ-8842)
```
