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

1. **Exploration subagent** — queue + completed/updated issues in period (default: last 24h or `--days=7`).
2. **Execution subagent** — format report (template below).
3. **Verification subagent** — confirm period, project scope, and no fabricated keys.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--days=N` | `1` | Reporting window |
| `--audience=team` | team | `team`, `lead`, `executive` |
| `--confluence` | off | Atlassian only; ask before publish |

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
