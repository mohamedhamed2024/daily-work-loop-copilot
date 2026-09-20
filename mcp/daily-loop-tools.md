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
| `get_subagent_prompt` | Ready-made Task prompt for `exploration`, `execution`, or `verification` |
| `list_daily_loop_skills` | Skill names and paths |
| `plan_daily_status_report` | Steps, args, and skill path for status reports |

## Stack MCP (separate plugins)

This server does **not** replace:

| Stack | MCP |
|-------|-----|
| `atlassian` | Official **Atlassian** plugin (`plugin-atlassian-atlassian`) |
| `github` | Official **GitHub** plugin (`plugin-github-github`) |

Typical flow:

1. MCP `get_daily_loop_command` → agent loads procedure.
2. MCP `get_subagent_prompt` → launch exploration Task.
3. Atlassian/GitHub MCP → fetch live data.
4. Execution / verification subagents → user-facing output.

## Status report + Atlassian

For Confluence publishing, also use Atlassian **generate-status-report** skill after `plan_daily_status_report` when `INTEGRATION_STACK=atlassian`.

## Security

- This MCP server is **read-only** (reads plugin markdown only).
- No secrets; no issue/PR writes.
- Writes still go through stack MCP + write gate + user approval.
