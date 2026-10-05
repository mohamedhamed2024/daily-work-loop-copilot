# Daily report JSON for HTML publish

When using `/daily-status-report --publish=html`, build this JSON from exploration + execution output, then render with `scripts/render-daily-report-html/render.mjs`.

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | No | Page title; default derived from `project` and dates |
| `project` | Recommended | Jira project keys or repo name |
| `periodStart` | Yes | ISO date or readable start of window |
| `periodEnd` | Yes | ISO date or end of window |
| `audience` | No | `team`, `lead`, or `executive` |
| `integrationStack` | No | `atlassian` or `github` |
| `syncedAt` | No | ISO-8601 UTC; script sets **now** if omitted (shown as **Last synced**) |
| `summary` | Recommended | `{ completedIssues, mergedPrs, inProgress, blocked }` (numbers or strings) |
| `highlights` | Recommended | string[] |
| `blockers` | Recommended | `{ item, owner, mitigation }[]` |
| `prHealth` | No | string[] |
| `nextFocus` | No | string[] |
| `sections` | No | Extra `{ title, items[] }` or `{ title, html }` (html must be escaped safe content only) |
| `footerNote` | No | Footer line |

## Example

```json
{
  "title": "Daily status — ENG — 2026-09-28",
  "project": "ENG",
  "periodStart": "2026-09-27",
  "periodEnd": "2026-09-28",
  "audience": "team",
  "integrationStack": "github",
  "summary": {
    "completedIssues": 4,
    "mergedPrs": 2,
    "inProgress": "WI-8842, PR #412",
    "blocked": 1
  },
  "highlights": [
    "Shipped auth fix (#418)",
    "Queue ranking plugin 0.3.0 merged"
  ],
  "blockers": [
    {
      "item": "PR #412 review",
      "owner": "Alex",
      "mitigation": "Ping in standup; cover reviewer if OOO"
    }
  ],
  "prHealth": ["2 open PRs; 1 stale review >2d"],
  "nextFocus": ["Finish WI-8842", "Unblock PR #412"]
}
```

## Render command

From the **pilot repo** root (not the plugin repo):

```bash
node path/to/daily-work-loop-copilot/scripts/render-daily-report-html/render.mjs \
  --input /tmp/daily-report.json \
  --output docs/index.html
```

Or with plugin installed:

```bash
"${CURSOR_PLUGIN_ROOT}/scripts/render-daily-report-html/run.sh" \
  --input .cursor/daily-report.json \
  --output docs/index.html
```

Commit `docs/index.html` and push for GitHub Pages. See [plugin/github-pages-daily-report.md](../../../plugin/github-pages-daily-report.md).
