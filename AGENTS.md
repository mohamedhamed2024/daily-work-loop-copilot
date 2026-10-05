# Agent entry points — Daily Work Loop Copilot

**Demos and onboarding:** [plugin/how-it-works.md](./plugin/how-it-works.md)

Installable **Cursor plugin** for day-to-day engineering workflows. Supports two MCP stacks (choose one per workspace via **`INTEGRATION_STACK`**):

| Stack | Work items | PRs / CI | Plugin |
|-------|------------|----------|--------|
| **`atlassian`** (default) | Jira | Bitbucket | Official **Atlassian** Cursor plugin (OAuth) |
| **`github`** | GitHub Issues | GitHub PRs + checks | Official **GitHub** Cursor plugin / MCP |

Manifest: [.cursor-plugin/plugin.json](./.cursor-plugin/plugin.json). Stack guide: [mcp/integration-stacks.md](./mcp/integration-stacks.md).

## Configure

Plugins → **daily-work-loop-copilot** → **Configure**:

- **`INTEGRATION_STACK`:** `atlassian` or `github`
- **Atlassian:** `JIRA_PROJECT_KEYS`, `BITBUCKET_WORKSPACE`, optional `BITBUCKET_REPO_SLUG`
- **GitHub:** `GITHUB_OWNER`, `GITHUB_REPO`
- **Shared:** `STALE_REVIEW_DAYS`, linking patterns
- **Optional:** `DAILY_REPORT_HTML_PATH` for `/daily-status-report --publish=html` (GitHub Pages)

Optional local mirror: [`.env.example`](./.env.example) — [config/env.md](./config/env.md).

## Agents (Gather → Draft; parent Check on EOD/handoff)

Run via **Task** tool per [agents/subagent-orchestration.md](./agents/subagent-orchestration.md). Plain language: [plugin/how-it-works.md](./plugin/how-it-works.md).

| Phase | File |
|-------|------|
| Orchestration guide | [agents/subagent-orchestration.md](./agents/subagent-orchestration.md) |
| Gather | [agents/exploration.md](./agents/exploration.md) |
| Draft | [agents/execution.md](./agents/execution.md) |
| Check (parent) | [agents/verification.md](./agents/verification.md) |

## Commands

| Command | File |
|---------|------|
| `/start-day` | [commands/start-day.md](./commands/start-day.md) |
| `/my-queue` | [commands/my-queue.md](./commands/my-queue.md) |
| `/next-task` | [commands/next-task.md](./commands/next-task.md) |
| `/eod-wrap` | [commands/eod-wrap.md](./commands/eod-wrap.md) |
| `/handoff` | [commands/handoff.md](./commands/handoff.md) |
| `/daily-status-report` | [commands/daily-status-report.md](./commands/daily-status-report.md) — optional `--publish=html` → [plugin/github-pages-daily-report.md](./plugin/github-pages-daily-report.md); schedule via [automation/cursor-daily-report-automation.md](./automation/cursor-daily-report-automation.md) |

## Skills (load orchestrator first)

| Skill | Path |
|-------|------|
| Orchestrator | [skills/daily-work-loop/SKILL.md](./skills/daily-work-loop/SKILL.md) |
| Queue ranking | [skills/work-queue-ranking/SKILL.md](./skills/work-queue-ranking/SKILL.md) |
| Atlassian data | [skills/jira-bitbucket-daily-data/SKILL.md](./skills/jira-bitbucket-daily-data/SKILL.md) |
| GitHub data | [skills/github-daily-data/SKILL.md](./skills/github-daily-data/SKILL.md) |
| EOD wrap | [skills/daily-eod-wrap/SKILL.md](./skills/daily-eod-wrap/SKILL.md) |
| Handoff | [skills/daily-handoff/SKILL.md](./skills/daily-handoff/SKILL.md) |
| Status report | [skills/daily-status-report/SKILL.md](./skills/daily-status-report/SKILL.md) |

Load **daily-work-loop** when the user runs any daily-loop command.

## MCP servers

| Server | Role |
|--------|------|
| **daily-loop-tools** (bundled) | `list_daily_loop_commands`, `get_daily_loop_command`, `get_subagent_prompt`, `plan_daily_status_report`, `render_daily_report_html` — [mcp/daily-loop-tools.md](./mcp/daily-loop-tools.md) |
| **Atlassian** or **GitHub** (official plugins) | Live issues, PRs, CI |

## Rules

| Rule | Always apply |
|------|----------------|
| [daily-loop-policy.mdc](./rules/daily-loop-policy.mdc) | Yes |
| [work-item-linking.mdc](./rules/work-item-linking.mdc) | No |

Plain English: [rules/README.md](./rules/README.md). Precedence: [rules/precedence.md](./rules/precedence.md).

## Hooks (guardrails)

Registered in [hooks/hooks.json](./hooks/hooks.json). Summary: [hooks/README.md](./hooks/README.md).

Stale reviews and failing CI surface in `/start-day` and `/my-queue --filter=blocked` (`STALE_REVIEW_DAYS`). They are not a session-start hook.

## MCP and writes

- Read-only MCP until user approves writes.
- Drafts by default. The write gate allows a post only when **`.cursor/daily-loop-write-approved`** exists. Say **`APPROVE_WORK_ITEM_WRITE`** (or `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE`) to create that file and post; remove it after use.
- See [mcp/security-and-auth.md](./mcp/security-and-auth.md), [mcp/github-issues-prs.md](./mcp/github-issues-prs.md), [mcp/atlassian-bitbucket-jira.md](./mcp/atlassian-bitbucket-jira.md).

## Owner

Cross-cutting daily-loop automation for teams that install the plugin. Pilot repos: pointer in local `AGENTS.md` — [plugin/install.md](./plugin/install.md).

Multi-repo handoff across many repos: out of scope for MVP — [automation/cloud-agent.md](./automation/cloud-agent.md).
