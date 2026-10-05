#!/usr/bin/env node
/**
 * Render a structured daily status report as a self-contained HTML page for GitHub Pages.
 * Usage:
 *   node render.mjs --input report.json --output docs/index.html
 *   cat report.json | node render.mjs --output docs/index.html
 */
import fs from "fs";
import path from "path";

function parseArgs(argv) {
  const out = { input: null, output: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--input" && argv[i + 1]) out.input = argv[++i];
    else if (a === "--output" && argv[i + 1]) out.output = argv[++i];
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSyncDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return escapeHtml(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
      timeZoneName: "short",
    });
  } catch {
    return escapeHtml(iso);
  }
}

function listItems(items) {
  if (!items?.length) return "<p class=\"muted\">None reported.</p>";
  return `<ul>${items.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`;
}

function blockersTable(rows) {
  if (!rows?.length) return "<p class=\"muted\">None reported.</p>";
  const head = `<thead><tr><th>Item</th><th>Owner</th><th>Mitigation</th></tr></thead>`;
  const body = rows
    .map(
      (r) =>
        `<tr><td>${escapeHtml(r.item ?? r.name ?? "")}</td><td>${escapeHtml(r.owner ?? "")}</td><td>${escapeHtml(r.mitigation ?? r.next ?? "")}</td></tr>`
    )
    .join("");
  return `<table>${head}<tbody>${body}</tbody></table>`;
}

function buildHtml(report) {
  const syncedAt = report.syncedAt || new Date().toISOString();
  const title = report.title || `Daily status — ${report.project || "team"} — ${report.periodEnd || ""}`;
  const project = report.project || "";
  const audience = report.audience || "team";
  const periodStart = report.periodStart || "";
  const periodEnd = report.periodEnd || "";
  const stack = report.integrationStack || "";

  const summary = report.summary || {};
  const summaryLines = [
    summary.completedIssues != null && `Completed issues: ${summary.completedIssues}`,
    summary.mergedPrs != null && `Merged PRs: ${summary.mergedPrs}`,
    summary.inProgress != null && `In progress: ${summary.inProgress}`,
    summary.blocked != null && `Blocked: ${summary.blocked}`,
  ].filter(Boolean);

  const customSections = (report.sections || [])
    .map(
      (sec) =>
        `<section><h2>${escapeHtml(sec.title || "Section")}</h2>${sec.html ? sec.html : listItems(sec.items || sec.bullets)}</section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="daily-loop-last-sync" content="${escapeHtml(syncedAt)}" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #0f1419;
      --surface: #1a2332;
      --text: #e7ecf3;
      --muted: #9aa5b5;
      --accent: #3d8bfd;
      --border: #2a3544;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .wrap { max-width: 52rem; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
    header {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    h1 { font-size: 1.35rem; margin: 0 0 0.5rem; }
    .meta { color: var(--muted); font-size: 0.9rem; }
    .sync {
      display: inline-block;
      margin-top: 0.75rem;
      padding: 0.35rem 0.65rem;
      background: rgba(61, 139, 253, 0.15);
      border: 1px solid rgba(61, 139, 253, 0.35);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text);
    }
    section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1rem;
    }
    h2 { font-size: 1.05rem; margin: 0 0 0.75rem; color: var(--accent); }
    ul { margin: 0; padding-left: 1.25rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { text-align: left; padding: 0.5rem 0.4rem; border-bottom: 1px solid var(--border); }
    th { color: var(--muted); font-weight: 600; }
    .muted { color: var(--muted); margin: 0; }
    footer { margin-top: 2rem; font-size: 0.8rem; color: var(--muted); text-align: center; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p class="meta">
        ${project ? `<strong>Project:</strong> ${escapeHtml(project)} · ` : ""}
        <strong>Period:</strong> ${escapeHtml(periodStart)} – ${escapeHtml(periodEnd)} ·
        <strong>Audience:</strong> ${escapeHtml(audience)}
        ${stack ? ` · <strong>Stack:</strong> ${escapeHtml(stack)}` : ""}
      </p>
      <p class="sync" title="${escapeHtml(syncedAt)}">Last synced: ${formatSyncDate(syncedAt)}</p>
    </header>

    <section>
      <h2>Summary</h2>
      ${summaryLines.length ? listItems(summaryLines) : "<p class=\"muted\">No summary metrics.</p>"}
    </section>

    <section>
      <h2>Highlights</h2>
      ${listItems(report.highlights)}
    </section>

    <section>
      <h2>Risks / blockers</h2>
      ${blockersTable(report.blockers || report.risks)}
    </section>

    <section>
      <h2>PR / review health</h2>
      ${listItems(report.prHealth || report.pr_health)}
    </section>

    <section>
      <h2>Next period focus</h2>
      ${listItems(report.nextFocus || report.next_focus)}
    </section>

    ${customSections}

    <footer>
      ${escapeHtml(report.footerNote || "Generated by Daily Work Loop Copilot")} ·
      Sync timestamp (ISO): ${escapeHtml(syncedAt)}
    </footer>
  </div>
</body>
</html>
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.output) {
    console.error(
      "Usage: node render.mjs --output <path/to/index.html> [--input report.json]\n" +
        "  stdin JSON accepted when --input is omitted."
    );
    process.exit(args.help ? 0 : 1);
  }

  let raw;
  if (args.input) {
    raw = fs.readFileSync(args.input, "utf8");
  } else {
    raw = fs.readFileSync(0, "utf8");
  }

  if (!raw.trim()) {
    console.error("Error: empty input JSON");
    process.exit(1);
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch (e) {
    console.error("Error: invalid JSON", e.message);
    process.exit(1);
  }

  if (!report.syncedAt) {
    report.syncedAt = new Date().toISOString();
  }

  const html = buildHtml(report);
  const outPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log(JSON.stringify({ ok: true, path: outPath, syncedAt: report.syncedAt }));
}

main();
