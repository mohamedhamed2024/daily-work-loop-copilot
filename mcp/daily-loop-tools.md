# Daily Loop MCP tools (plugin server)

The plugin ships a **local MCP server** that exposes daily-loop **commands**, **subagent prompts**, and **status report** planning to any MCP client (Cursor Agent, external agents, automations).

## Enable

1. Install **daily-work-loop-copilot** plugin (includes [mcp.json](../mcp.json) entry `daily-loop-tools`).
2. Ensure **Node.js 18+** is on `PATH`.
3. First use: server runs `npm install` in `scripts/daily-loop-mcp/` (once).

Server path: `scripts/daily-loop-mcp/index.mjs`  
Root: `DAILY_LOOP_PLUGIN_ROOT` or `CURSOR_PLUGIN_ROOT` (set by Cursor).

## Tools

| Tool | Purpose |
|------|---------|
| `list_daily_loop_commands` | All slash commands + descriptions |
| `get_daily_loop_command` | Full markdown for one command (`start-day`, `eod-wrap`, …) |
| `get_subagent_prompt` | Task prompt for Gather (`exploration`) or Draft (`execution`); `verification` returns Check checklist for parent |
| `list_daily_loop_skills` | Skill names and paths |
| `plan_daily_status_report` | Steps, args, and skill path for status reports |
| `render_daily_report_html` | Write self-contained HTML with **Last synced** for GitHub Pages |

## Stack MCP (separate plugins)

This server does **not** replace:

| Stack | MCP |
|-------|-----|
| `atlassian` | Official **Atlassian** plugin (`plugin-atlassian-atlassian`) |
| `github` | Official **GitHub** plugin (`plugin-github-github`) |

Typical flow:

1. Slash command or MCP `get_daily_loop_command` → agent loads procedure.
2. Launch `daily-loop-exploration` (MCP `get_subagent_prompt` is optional for external clients).
3. Atlassian or GitHub MCP → fetch live data inside exploration.
4. Parent summarizes `/my-queue` and `/next-task`. **Draft** (`daily-loop-execution`) formats `/start-day`, `/eod-wrap`, `/handoff`, and `/daily-status-report`. **Check** (parent, [agents/verification.md](../agents/verification.md)) runs after `/eod-wrap` and `/handoff` drafts only.

## Status report + Atlassian

For Confluence publishing, also use Atlassian **generate-status-report** skill after `plan_daily_status_report` when `INTEGRATION_STACK=atlassian`.

## Security

- This MCP server is **read-only** (reads plugin markdown only).
- No secrets; no issue/PR writes.
- Writes still go through stack MCP + write gate + user approval.
