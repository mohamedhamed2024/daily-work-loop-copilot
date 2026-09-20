# Automation — Cursor / local tier

**Adopted:** Yes — primary surface for Daily Work Loop Copilot.

## Trigger

Developer runs slash commands in Cursor Agent chat:

- `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`

## Scope

Single workspace (pilot repo) plus Atlassian MCP identity of the signed-in user.

## Credentials

- Atlassian Rovo MCP OAuth/API token via official Atlassian Cursor plugin.
- Plugin configuration variables (non-secret) in `.cursor-plugin/plugin.json`.

## MCP usage

Read-heavy during day; writes only with `APPROVE_JIRA_WRITE` and write-gate approval file. See [mcp/atlassian-bitbucket-jira.md](../mcp/atlassian-bitbucket-jira.md).

## Review path

Human reviews all draft Jira comments and handoff docs before sharing or posting.

## Monitoring

Track adoption informally: daily command usage per dev/week (pilot spreadsheet or survey).

## Rollback

Disable plugin in Cursor Settings → Plugins; remove `.cursor/daily-loop-write-approved` from app repos if present.
