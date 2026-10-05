---
name: start-day
description: Morning brief with blockers, top three priorities, and suggested first action from the configured stack.
---

# `/start-day`

Morning planning: one brief view of meetings (if available), blockers, top priorities, and the first action to take.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/work-queue-ranking/SKILL.md`
3. Stack data skill: `skills/jira-bitbucket-daily-data/SKILL.md` when `INTEGRATION_STACK=atlassian`, otherwise `skills/github-daily-data/SKILL.md`
4. `agents/subagent-orchestration.md`

## Subagents

1. **`daily-loop-exploration`**
2. **`daily-loop-execution`** — morning brief from the exploration result

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--standup` | off | Include standup draft from `reference/output-templates.md` |
| `--focus=KEY` | none | Boost one work item in ranking (Jira key or GitHub issue) |

## Steps

1. Launch **`daily-loop-exploration`**.
2. Take top 3 from the exploration result with `why_now`.
3. Identify **blockers**, including reviews and owned failing CI older than `STALE_REVIEW_DAYS`. When those exist, point at `/my-queue --filter=blocked`.
4. **Calendar:** optional MCP; if unavailable, state “Calendar not available”.
5. Launch **`daily-loop-execution`** for the morning brief template.
6. **Suggested first action:** highest-ranked actionable item (prefer unblockers: reviews blocking your work, failing CI on your PR).

## Safety

- Read-only MCP for this command.
- Do not post work-item comments.

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
