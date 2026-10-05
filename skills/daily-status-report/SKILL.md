---
name: daily-status-report
description: >-
  Generate a daily or weekly engineering status report from Jira or GitHub work
  items plus PR activity. Use for /daily-status-report or MCP plan_daily_status_report.
---

# Daily status report

## Scope

Complements personal **daily loop** commands with a **team/project** snapshot suitable for standup, leads, or Confluence.

| Stack | Data | Extended Atlassian flow |
|-------|------|-------------------------|
| `atlassian` | Jira JQL + Bitbucket PRs | Optional: Atlassian plugin **generate-status-report** skill for Confluence publish |
| `github` | GitHub Issues + PRs | Markdown report in chat; no Confluence in MVP |

## Workflow

1. **`daily-loop-exploration`** — queue + completed/updated issues in period (default: last 24h or `--days`).
2. **`daily-loop-execution`** — format report (template below). The parent checks that the period, project scope, and issue keys match exploration output.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--days=N` | `1` | Reporting window |
| `--audience=team` | team | `team`, `lead`, `executive` |
| `--confluence` | off | Atlassian only; ask before publish |
| `--publish=html` | off | Render static HTML to `DAILY_REPORT_HTML_PATH` for GitHub Pages (includes **Last synced**) |

## GitHub Pages HTML

When `--publish=html`:

1. Map exploration + execution output to JSON ([reference/report-json-schema.md](./reference/report-json-schema.md)).
2. Run `scripts/render-daily-report-html/render.mjs` → `DAILY_REPORT_HTML_PATH` (default `docs/index.html`).
3. Page header shows **Last synced** from `syncedAt`; `<meta name="daily-loop-last-sync">` in HTML for tooling.

Setup and daily git workflow: [plugin/github-pages-daily-report.md](../../plugin/github-pages-daily-report.md).

## Atlassian + Confluence

When `INTEGRATION_STACK=atlassian` and user wants Confluence:

1. Load Atlassian marketplace skill **generate-status-report** (if installed).
2. Use same `JIRA_PROJECT_KEYS` and reporting period.
3. **Draft** in chat first; publish only after explicit user approval (separate from issue comment approval).

## Report template (chat)

```markdown
# Daily status — {project} — {date}

**Period:** {start}–{end}  
**Audience:** {audience}

## Summary
- Completed: N issues | Merged PRs: N
- In progress: …
- Blocked: …

## Highlights
- …

## Risks / blockers
| Item | Owner | Mitigation |

## PR / review health
- …

## Next period focus
- …
```

## MCP

Tool `plan_daily_status_report` returns this skill path + suggested subagent sequence.
