---
name: daily-status-report
description: Generate daily or weekly project status from Jira/GitHub and PR activity; optional Confluence via Atlassian skill.
---

# `/daily-status-report`

Project/team status report (broader than personal `/start-day`).

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-status-report/SKILL.md`
3. Stack data skill (jira-bitbucket or github)
4. [agents/subagent-orchestration.md](../agents/subagent-orchestration.md)

## Subagents

1. **`daily-loop-exploration`** — issues and PRs updated in the window; blockers; merges.
2. **`daily-loop-execution`** — formatted report (`--audience`).

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--days=1` | 1 | Lookback days |
| `--audience=team` | team | `team`, `lead`, `executive` |
| `--confluence` | off | Atlassian: offer Confluence publish via generate-status-report skill |
| `--publish=html` | off | Write GitHub Pages HTML to `DAILY_REPORT_HTML_PATH` (default `docs/index.html`) |

## Publish HTML (GitHub Pages)

When the user passes **`--publish=html`** (or asks for a daily HTML page / GitHub Pages):

1. Complete exploration and execution as usual; draft the same facts in chat.
2. Build JSON per [skills/daily-status-report/reference/report-json-schema.md](../skills/daily-status-report/reference/report-json-schema.md). Set `syncedAt` to current UTC ISO time.
3. Resolve output path from plugin **`DAILY_REPORT_HTML_PATH`** (default `docs/index.html`).
4. Run the renderer (Node 18+):

```bash
node "${CURSOR_PLUGIN_ROOT}/scripts/render-daily-report-html/render.mjs" \
  --input <temp-json-path> \
  --output "<workspace>/<DAILY_REPORT_HTML_PATH>"
```

5. Tell the user the file path, the **Last synced** time shown in the page header, and the GitHub Pages URL pattern after push. Setup: [plugin/github-pages-daily-report.md](../plugin/github-pages-daily-report.md).

6. Offer to `git add` and commit only if the user asks. Do not push without explicit request.

Optional: also write `.cursor/daily-report.json` in the workspace with the same JSON for the next run’s diff.

## Safety

- Draft in chat first.
- Confluence/Jira publish only with explicit user approval.
- Read-only MCP until approved.
- HTML publish is a local file write in the user’s repo; treat report content as **public** if GitHub Pages is enabled.

## Examples

```text
/daily-status-report
/daily-status-report --days=7 --audience=lead
/daily-status-report --publish=html
/daily-status-report --days=1 --publish=html --audience=team
/daily-status-report --confluence
```
