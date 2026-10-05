# Rule precedence

When guidance conflicts, apply this order (highest first):

1. **Organization policy** — security, compliance, HR, official engineering standards.
2. **Repository [AGENTS.md](../AGENTS.md)** — entry points, stack, hook behavior.
3. **Plugin rules** (`rules/*.mdc`) — [daily-loop-policy.mdc](./daily-loop-policy.mdc) always applies when loaded.
4. **Orchestrator skill** — [skills/daily-work-loop/SKILL.md](../skills/daily-work-loop/SKILL.md).
5. **Focused skills** — queue, MCP data, EOD, handoff under `skills/*/SKILL.md`.
6. **Command file** — `commands/*.md` for the invoked slash command.

## What belongs where

| Content | Location |
|---------|----------|
| “Never auto-post” | `rules/daily-loop-policy.mdc` + write-gate hook |
| Work-item link in commit/branch | `rules/work-item-linking.mdc` |
| How to score the queue | `skills/work-queue-ranking/` + `config/queue-ranking.yaml` |
| Stale review threshold | `STALE_REVIEW_DAYS` + `config/queue-ranking.yaml`; surfaced by `/my-queue --filter=blocked` |
| MCP tool patterns | `mcp/atlassian-bitbucket-jira.md` or `mcp/github-issues-prs.md` + the stack data skill |
| Standup, EOD, and handoff shape | skills + `skills/daily-work-loop/reference/output-templates.md` |
| Step-by-step for `/eod-wrap` | `commands/eod-wrap.md` |

Move long “how to start/end your day” text out of duplicated **user rules** into this plugin; keep user rules thin and point to the plugin install.
