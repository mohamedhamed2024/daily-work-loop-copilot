---
name: work-queue-ranking
description: >-
  Builds and ranks the unified daily work queue from Jira issues, Bitbucket PRs,
  reviews, and CI signals using config/queue-ranking.yaml. Use with /my-queue,
  /next-task, /start-day, or exploration agent queue assembly.
---

# Work queue ranking

## Queue item model

Each row is a **queue item** with:

- `type`: `jira_issue` | `bitbucket_pr` | `github_issue` | `github_pr` | `review_request` | `ci_failure` | `blocker`
- `id`: Jira key or `workspace/repo#prId`
- `title`, `url`, `updated_at`, optional `due_date`
- `signals`: list of matched scoring rules
- `score`: integer (sum of weights)
- `blocked_by`: optional human-readable reason

## Configuration

Read [config/queue-ranking.yaml](../../config/queue-ranking.yaml). Plugin variables:

- `STALE_REVIEW_DAYS` — multiply stale days by `pr_stale_review_days_multiplier`
- User `--focus=PROJ-123` — add `user_focus_issue` weight to that key

## Scoring procedure

1. Collect raw items from exploration (Jira assignee/sprint, Bitbucket PRs, review requests, failing builds).
2. For each item, add weights for every matching signal (priority, blocked status, due dates, CI, reviews, “blocks my issue”).
3. Sort by **score descending**, then apply **tie_breakers** from config.
4. Attach `signals` and one-line **why now** for the top entries.

## Filters

| Flag | Config block | Behavior |
|------|--------------|----------|
| `--filter=blocked` | `filters.blocked` | Only items matching blocked include_if |
| `--filter=in_progress` | `filters.in_progress` | Active Jira + open authored PRs |
| (none) | — | Full ranked list |

## `/next-task` selection

Pick rank #1 unless:

- User passed `--focus=KEY` and that item exists (boost already applied).
- User said “skip reviews” or similar → deprioritize `review_request` types.
- Top item is blocked by external party → pick next actionable item and say why.

Always show score breakdown for the chosen item (transparency).

## Confidence

Set per `queue-ranking.yaml` `confidence` section based on MCP/git success.

## Do not

- Use opaque ML ranking; every score must map to named signals.
- Hide lower-priority items in `/my-queue` (show full list or paginate with summary count).
