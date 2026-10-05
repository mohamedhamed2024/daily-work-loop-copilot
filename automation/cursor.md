# Automation — Cursor / local tier

**Adopted:** Yes — primary surface for Daily Work Loop Copilot.

## Trigger

Developer runs slash commands in Cursor Agent chat:

- `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`, `/daily-status-report`

## Scope

Single workspace (pilot repo) plus Atlassian MCP identity of the signed-in user.

## Credentials

- Atlassian Rovo MCP OAuth/API token via official Atlassian Cursor plugin.
- Plugin configuration variables (non-secret) in `.cursor-plugin/plugin.json`.

## MCP usage

Read-heavy during the day. The write gate allows a mutation only when `.cursor/daily-loop-write-approved` exists. Create that file after `APPROVE_WORK_ITEM_WRITE` (or `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE`). See [mcp/security-and-auth.md](../mcp/security-and-auth.md).

## Review path

Human reviews all draft Jira comments and handoff docs before sharing or posting.

## Monitoring

Track adoption informally: daily command usage per dev/week (pilot spreadsheet or survey).

## Rollback

Disable plugin in Cursor Settings → Plugins; remove `.cursor/daily-loop-write-approved` from app repos if present.
