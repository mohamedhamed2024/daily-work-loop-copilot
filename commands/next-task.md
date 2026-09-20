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

## Subagents (required)

**Task exploration** → **Task execution**.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--focus=KEY` | none | Prefer/boost matching Jira key |
| `--skip-reviews` | off | Deprioritize review_request items |

## Steps

1. **Exploration** subagent → ranked queue.
2. Select rank #1 actionable item per ranking skill rules; honor `--focus` and `--skip-reviews`.
3. **Execution** subagent → next-task template with **Because** citing score signals.
4. Include links to Jira and Bitbucket from MCP responses.

## Safety

Read-only MCP.

## Examples

```text
/next-task
/next-task --focus=PROJ-8842
/next-task --skip-reviews
```

## Override

If user says “actually do X instead”, accept override without re-ranking entire queue.
