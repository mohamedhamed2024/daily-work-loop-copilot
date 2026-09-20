# Stale attention hook

Warn when high-priority work is blocked only by you (PR review waiting longer than threshold, failing CI on PRs you own).

## Implementation

| Event | Handler |
|-------|---------|
| `sessionStart` | Prompt hook in [hooks.json](./hooks.json) (second `sessionStart` entry) |

## Trigger

- New agent session start.
- Threshold: plugin variable `STALE_REVIEW_DAYS` (default `2`).

## Behavior

**Warn** once per session if stale reviews or owned failing CI detected (via MCP during prompt evaluation or suggest `/my-queue --filter=blocked`).

## User message

> You may have stale PR reviews or failing CI on your PRs (>{STALE_REVIEW_DAYS}d). Run `/my-queue --filter=blocked`.

## Test cases

1. Session start with no MCP auth → silent or low-confidence nudge only.
2. Review waiting 3 days → warn with PR reference when MCP data available.

## Related

- `rules/pr-review-sla.mdc`
- `config/queue-ranking.yaml` weights `pr_stale_review_days_multiplier`
