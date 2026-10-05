# GitHub Pages — daily HTML status report

Publish a **daily updated** team status page with a visible **Last synced** timestamp.

## Overview

1. Configure output path in the plugin (default below).
2. Each day, run `/daily-status-report --publish=html` in Cursor.
3. The agent writes JSON, runs the HTML renderer, and commits `docs/index.html` when you ask.
4. GitHub Pages serves the file from your repo.

## Plugin configure

| Variable | Default | Purpose |
|----------|---------|---------|
| `DAILY_REPORT_HTML_PATH` | `docs/index.html` | File to overwrite on each publish |

Path is relative to your **application repo** root (the repo you open in Cursor), not the plugin install directory.

## GitHub Pages setup (once)

1. In your app repo, create `docs/` (or match your configured path).
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main` (or default), folder: **`/docs`**.
4. After the first push containing `docs/index.html`, the site URL is typically:
   - `https://<user>.github.io/<repo>/`
   - or org pages URL if using org site layout.

Optional: add a link in the repo README to that URL.

## Daily workflow

```text
/daily-status-report --publish=html
```

The agent will:

1. Run Gather + Draft (same as chat report).
2. Map results to [report JSON schema](../skills/daily-status-report/reference/report-json-schema.md).
3. Run `scripts/render-daily-report-html/render.mjs` with `--output` = `DAILY_REPORT_HTML_PATH`.
4. Show the **Last synced** time from `syncedAt` in the page header.

Then commit and push:

```bash
git add docs/index.html
git commit -m "chore: update daily status report"
git push
```

Pages rebuilds within a few minutes.

## Cursor Automation (daily)

To run this **on a schedule** without opening Cursor each day:

1. Vendor `scripts/render-daily-report-html/render.mjs` into your **app repo** (Cloud Agent only sees that repo).
2. Create a **Cursor Automation** with a **cron** trigger (e.g. weekdays 9:00).
3. Enable **GitHub** or **Atlassian** MCP on the automation and connect OAuth before save.
4. Paste the prompt from [automation/daily-report-automation-prompt.md](../automation/daily-report-automation-prompt.md).

Full setup: [automation/cursor-daily-report-automation.md](../automation/cursor-daily-report-automation.md).

## Optional: deploy on push

Copy [automation/github-pages-daily-report.yml.example](../automation/github-pages-daily-report.yml.example) to your app repo as `.github/workflows/daily-report-pages.yml`. It only publishes when `docs/index.html` changes (no MCP in CI).

## Security

- The HTML page is **public** on GitHub Pages unless the repo is private (private Pages depends on org plan).
- Do not put secrets, internal-only names, or unreleased product details in the report without review.
- MCP remains read-only; publishing HTML is a **git write** in your repo, not a Jira/GitHub MCP mutation.

## Verify

Open the Pages URL and confirm:

- **Last synced** matches today’s run.
- `<meta name="daily-loop-last-sync" content="...">` in page source for automations.
