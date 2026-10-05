# Automation — routine / scheduled tier

**Adopted:** Optional — **daily HTML status report** via Cursor Automation.

## Daily status → GitHub Pages

Use a **scheduled Cursor Automation** on your pilot app repo to run the daily status report, render HTML, commit, and push.

| Doc | Purpose |
|-----|---------|
| [cursor-daily-report-automation.md](./cursor-daily-report-automation.md) | Setup: cron, MCP, repo, Cloud Agent |
| [daily-report-automation-prompt.md](./daily-report-automation-prompt.md) | Paste-ready automation instructions |
| [../plugin/github-pages-daily-report.md](../plugin/github-pages-daily-report.md) | GitHub Pages one-time setup |

## Not adopted (MVP)

- Scheduled Slack/email digest without HTML publish
- EOD reminder if git activity detected without `/eod-wrap`

## If you add other scheduled automations

Document trigger, repo scope, MCP read-only policy, and human review before enabling writes outside git.
