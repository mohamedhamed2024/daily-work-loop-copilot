---
name: my-queue
description: Full ranked work queue from the configured stack (Jira and Bitbucket, or GitHub Issues and PRs) using transparent scoring rules.
---

# `/my-queue`

Show the complete prioritized queue with scores and signals.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/work-queue-ranking/SKILL.md`
3. Stack data skill: `jira-bitbucket-daily-data` or `github-daily-data` per `INTEGRATION_STACK`
4. `agents/subagent-orchestration.md`

## Subagents

**`daily-loop-exploration`**. The parent formats the queue table. Do not launch execution.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--filter=blocked` | none | Blocked items, stale reviews, and failing CI per `config/queue-ranking.yaml` and `STALE_REVIEW_DAYS` |
| `--filter=in_progress` | none | Active work items plus open authored PRs |
| `--focus=KEY` | none | Boost one Jira key or GitHub issue in scoring |

## Steps

1. **`daily-loop-exploration`** → queue with confidence level.
2. Apply filter flags before presenting.
3. Parent renders the markdown table from `reference/output-templates.md`.
4. Append **unlinked work** when commits or PRs lack a Jira key or GitHub issue ref.
5. Show **confidence** and data gaps at the bottom.

## Safety

Read-only. No work-item or PR writes.

## Examples

```text
/my-queue
/my-queue --filter=blocked
/my-queue --focus=PROJ-8801
```
