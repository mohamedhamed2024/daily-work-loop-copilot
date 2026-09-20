# Rule precedence

When guidance conflicts, apply this order (highest first):

1. **Organization policy** — security, compliance, HR, official engineering standards.
2. **Repository [AGENTS.md](../AGENTS.md)** — entry points, stack, hook behavior.
3. **Plugin rules** (`rules/*.mdc`) — persistent policy; `daily-loop-write-safety.mdc` always applies when loaded.
4. **Orchestrator skill** — [skills/daily-work-loop/SKILL.md](../skills/daily-work-loop/SKILL.md).
5. **Focused skills** — queue, MCP data, EOD, handoff under `skills/*/SKILL.md`.
6. **Command file** — `commands/*.md` for the invoked slash command.

## What belongs where

| Content | Location |
|---------|----------|
| “Never auto-post to Jira” | `rules/daily-loop-write-safety.mdc` + hooks |
| Jira key in commit/branch | `rules/work-item-linking.mdc` |
| How to score the queue | `skills/work-queue-ranking/` + `config/queue-ranking.yaml` |
| MCP tool patterns | `mcp/atlassian-bitbucket-jira.md` + `skills/jira-bitbucket-daily-data/` |
| Standup/EOD/handoff prose shape | rules (format) + skills (procedure) + `reference/output-templates.md` |
| Step-by-step for `/eod-wrap` | `commands/eod-wrap.md` |

Move long “how to start/end your day” text out of duplicated **user rules** into this plugin; keep user rules thin and point to the plugin install.
