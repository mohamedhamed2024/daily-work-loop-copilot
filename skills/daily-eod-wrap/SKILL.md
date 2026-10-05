---
name: daily-eod-wrap
description: >-
  End-of-day wrap: shipped vs in progress vs blocked, draft Jira comments from
  today’s activity, and open loops. Use for /eod-wrap and open-loop hook context.
---

# Daily EOD wrap

## Inputs

- Today’s git log (author-filtered)
- Bitbucket PR activity today (merged, updated, review submitted)
- Jira issues touched or implied by keys in commits/PRs
- Current ranked queue snapshot (optional, for “still in progress”)

## Sections (required)

1. **Shipped** — Merged PRs, completed Jira transitions (from MCP read only), meaningful commits on main/release branches.
2. **In progress** — Active Jira + open PRs with % or plain-language status.
3. **Blocked** — Waiting on review, CI, or another team; name the blocker.
4. **Draft Jira comments** — One block per affected key; **not posted** unless user approves writes.
5. **Open loops** — Table: loop, owner, next step, by when.

Template: [../daily-work-loop/reference/output-templates.md](../daily-work-loop/reference/output-templates.md).

## Draft comment guidelines

- Past tense, factual, link PRs and commits.
- Mention what remains if not done.
- Do not change Jira status fields in MVP; comments only when approved.

Example draft:

```markdown
Completed implementation for X; PR {link} open for review. CI green on latest push. Remaining: address review feedback on error handling.
```

## `--update-tickets`

| Value | Behavior |
|-------|----------|
| `draft` (default) | Show drafts in chat only |
| `approved` | User must also send `APPROVE_WORK_ITEM_WRITE` (or `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE`). The parent creates `.cursor/daily-loop-write-approved`, then MCP may post comments. Remove the file after the post. |

## Open loop rules

Every loop must have **owner** (person or team), **next step**, and **date**. If unknown, list as “TBD” and fail **Check** until the user fills them in.

## Hook alignment

The **open loop** hook fires on `sessionEnd` as a one-sentence reminder when the session likely had code or PR activity and `/eod-wrap` did not run. It does not block close and does not judge loop completeness. That check happens in parent **Check** ([agents/verification.md](../../agents/verification.md)).
