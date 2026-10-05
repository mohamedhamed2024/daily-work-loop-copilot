# Paste into Cursor Automation → Instructions

Replace `{{...}}` placeholders, then paste as the automation prompt.

---

You are running the **Daily Work Loop Copilot** daily status report for GitHub Pages.

## Config

- Integration stack: **{{INTEGRATION_STACK}}** (`atlassian` or `github`)
- Atlassian: Jira project keys **{{JIRA_PROJECT_KEYS}}**, Bitbucket workspace **{{BITBUCKET_WORKSPACE}}**
- GitHub: owner **{{GITHUB_OWNER}}**, repo **{{GITHUB_REPO}}**
- HTML output path: **{{DAILY_REPORT_HTML_PATH}}** (default `docs/index.html`)
- Reporting window: last **1** day, audience **team**

## Procedure

1. Follow the same data gathering as `/daily-status-report --days=1 --audience=team --publish=html`:
   - Read-only MCP only (GitHub or Atlassian per stack).
   - Gather issues and PRs updated in the window, merges, blockers, and review health.
2. Build a JSON object matching the daily-work-loop-copilot schema (fields: `title`, `project`, `periodStart`, `periodEnd`, `audience`, `integrationStack`, `syncedAt` as current UTC ISO-8601, `summary`, `highlights`, `blockers`, `prHealth`, `nextFocus`). Do not invent issue keys or PR numbers.
3. Write JSON to `.cursor/daily-report.json` in the repo root.
4. Run:

   ```bash
   node scripts/render-daily-report-html/render.mjs \
     --input .cursor/daily-report.json \
     --output {{DAILY_REPORT_HTML_PATH}}
   ```

5. Verify the generated HTML contains **Last synced** in the header and `<meta name="daily-loop-last-sync">`.
6. Git: stage `{{DAILY_REPORT_HTML_PATH}}` and optionally `.cursor/daily-report.json`.
7. Commit with message: `chore: daily status report $(date -u +%Y-%m-%d)`
8. Push to the default branch so GitHub Pages updates.

## Safety

- Never call MCP write tools (no issue comments, transitions, merges, or PR approvals).
- Do not include secrets or credentials in the HTML.
- If MCP is unavailable, stop and report failure; do not publish placeholder fake data.

## Done

Reply with: path to HTML, **Last synced** timestamp, commit SHA, and the public GitHub Pages URL (typically `https://<user>.github.io/<repo>/`).
