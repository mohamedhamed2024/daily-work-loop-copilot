---
name: my-queue
description: Full ranked work queue from Jira, Bitbucket PRs, reviews, and CI using transparent scoring rules.
---

# `/my-queue`

Show the complete prioritized queue with scores and signals.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/work-queue-ranking/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. `agents/subagent-orchestration.md`

## Subagents (required)

**Task exploration** → **Task execution** (queue table). MCP: `get_subagent_prompt`.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--filter=blocked` | none | Only blocked-type items per `config/queue-ranking.yaml` |
| `--filter=in_progress` | none | Active Jira + open authored PRs |
| `--focus=KEY` | none | Boost one Jira issue in scoring |

## Steps

1. **Exploration** subagent → queue with confidence level.
2. Apply filter flags before presenting.
3. **Execution** subagent → markdown table
4. Append **unlinked work** list if any commits/PRs lack Jira keys.
5. Show **confidence** and data gaps at bottom.

## Safety

Read-only. No Jira/Bitbucket writes.

## Examples

```text
/my-queue
/my-queue --filter=blocked
/my-queue --focus=PROJ-8801
```
