# Uninstall

1. Cursor **Settings → Plugins** → remove **daily-work-loop-copilot**.
2. In pilot app repos, remove the Daily work loop snippet from `AGENTS.md` if added during install.
3. Delete approval flag if present: `.cursor/daily-loop-write-approved` (do not commit this file).
4. Atlassian MCP can remain installed for other workflows; revoking OAuth is optional in Atlassian account settings.

No database or server-side state is created by this plugin.
