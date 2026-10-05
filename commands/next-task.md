---
name: next-task
description: Recommend the single best next action with rationale, links, and a fallback if blocked.
---

# `/next-task`

Pick one next action from the ranked queue.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/work-queue-ranking/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. `agents/subagent-orchestration.md`

## Subagents

**`daily-loop-exploration`**. The parent writes the next-task card. Do not launch execution.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--focus=KEY` | none | Prefer or boost a Jira key or GitHub issue |
| `--skip-reviews` | off | Deprioritize review_request items |

## Steps

1. **`daily-loop-exploration`** → ranked queue.
2. Select rank #1 actionable item per the ranking skill; honor `--focus` and `--skip-reviews`.
3. Parent fills the next-task template. **Because** cites score signals.
4. Include work-item and PR links from the exploration result.

## Safety

Read-only MCP.

## Examples

```text
/next-task
/next-task --focus=PROJ-8842
/next-task --skip-reviews
```

## Override

If the user says to do something else, accept the override without re-ranking the entire queue.
