# Data handling

## What this plugin stores

- **In repo:** Markdown skills, rules, commands, config — no user secrets. Use [`.env.example`](../.env.example) as template; `.env` is gitignored.
- **Plugin variables / `.env`:** Project keys, workspace slug, optional API tokens — set in Cursor Configure or local `.env`, never committed.
- **Not stored in repo:** OAuth tokens (held by Cursor/Atlassian integration).

## What flows to the AI model

During commands, the agent may include in context:

- Jira issue summaries, statuses, assignees
- Bitbucket PR titles, statuses, review/CI metadata
- Local git commit messages and branch names
- Draft comments and handoff text you generate

Do not paste passwords, API keys, or customer PII into Jira comments or handoff docs.

## Writes

- Default: **no** Jira/Bitbucket mutations via MCP.
- Approved writes: user-initiated; gated by hook and `.cursor/daily-loop-write-approved` in the **application repo**.

## Retention

- Chat history: per Cursor product retention policies.
- Atlassian: per your organization’s Jira/Bitbucket retention.

## License / compliance

Pilot teams should confirm use of Atlassian Rovo MCP with security review ([mcp/security-and-auth.md](../mcp/security-and-auth.md) checklist).
