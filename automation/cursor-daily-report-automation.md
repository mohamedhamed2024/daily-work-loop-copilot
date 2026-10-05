# Cursor Automation — daily HTML status report

Run **`/daily-status-report --publish=html`** on a schedule via a **Cursor Automation** (Cloud Agent on your repo). The automation refreshes `docs/index.html`, commits, and pushes so GitHub Pages shows an updated **Last synced** time.

Manual alternative: [plugin/github-pages-daily-report.md](../plugin/github-pages-daily-report.md).

## Prerequisites

| Item | Notes |
|------|--------|
| **Pilot app repo** | The repo that hosts `docs/index.html` and GitHub Pages |
| **GitHub Pages** | Enabled once (see github-pages doc) |
| **Daily Work Loop plugin** | Configure `INTEGRATION_STACK`, project keys, and `DAILY_REPORT_HTML_PATH` |
| **Stack MCP in Automations** | Enable **GitHub** or **Atlassian** MCP on the automation (dashboard-eligible plugin server) and connect OAuth before save |
| **Renderer in repo** | Cloud agents only see the checked-out repo — vendor the script once (below) |
| **Cloud Agent** | Automation uses cloud compute; repo push access must be allowed for that agent |

## One-time: vendor the HTML renderer in your app repo

From your **app repo** root:

```bash
mkdir -p scripts/render-daily-report-html
cp "/path/to/daily-work-loop-copilot/scripts/render-daily-report-html/render.mjs" \
   scripts/render-daily-report-html/render.mjs
git add scripts/render-daily-report-html/render.mjs
git commit -m "chore: add daily report HTML renderer for automation"
git push
```

Node 18+ is available on Cloud Agent runners.

Optional: commit a stub `docs/index.html` from a first manual `/daily-status-report --publish=html` so Pages has content before the first cron run.

## Create the automation in Cursor

1. **Cursor → Automations → New automation**
2. **Trigger:** On a schedule  
   - Example: **Every weekday at 9:00** (`0 9 * * 1-5`)  
   - Or **Every day at 9:00** (`0 9 * * *`)  
   Cron uses the schedule you pick in the UI (confirm timezone there).
3. **Repository:** Your pilot app repo and default branch (e.g. `main`).
4. **Tools:** Enable **Use MCP server** and select:
   - **GitHub** MCP when `INTEGRATION_STACK=github`, or  
   - **Atlassian** MCP when `INTEGRATION_STACK=atlassian`  
   Connect/sign in before saving the automation.
5. **Instructions:** Paste the prompt from [daily-report-automation-prompt.md](./daily-report-automation-prompt.md). Replace placeholders (`{{OWNER}}`, `{{REPO}}`, project keys, etc.).
6. **Name:** e.g. `Daily status report → GitHub Pages`
7. Save and enable.

## What each run should do

1. Load daily-loop procedure: run equivalent of `/daily-status-report --days=1 --audience=team --publish=html`.
2. Read-only MCP: issues/PRs for the reporting window.
3. Build JSON per [report-json-schema.md](../skills/daily-status-report/reference/report-json-schema.md); set `syncedAt` to current UTC ISO time.
4. Render:

   ```bash
   node scripts/render-daily-report-html/render.mjs \
     --input .cursor/daily-report.json \
     --output docs/index.html
   ```

5. `git add` the HTML (and optional `.cursor/daily-report.json` if you keep it for diffs).
6. Commit: `chore: daily status report YYYY-MM-DD`
7. Push to the branch GitHub Pages uses.

Do **not** post Jira/GitHub comments or merge PRs. HTML content is public on Pages.

## Optional GitHub Action

If you use [github-pages-daily-report.yml.example](./github-pages-daily-report.yml.example), a push from the automation still triggers Pages deploy. The Action does not call MCP; it only publishes artifacts.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP blocked / empty report | Re-auth GitHub or Atlassian MCP on the automation |
| `render.mjs` not found | Vendor script into app repo (above) |
| Push rejected | Grant Cloud Agent write access to the repo; check branch protection |
| Stale **Last synced** | Automation did not push; check run logs and git history |
| Wrong project scope | Align plugin Configure vars with prompt placeholders |

## Related

- [daily-report-automation-prompt.md](./daily-report-automation-prompt.md) — paste-ready agent instructions  
- [routine.md](./routine.md) — automation tier status  
- [cursor.md](./cursor.md) — local slash-command tier  
