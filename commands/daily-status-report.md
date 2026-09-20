---
name: daily-status-report
description: Generate daily or weekly project status from Jira/GitHub and PR activity; optional Confluence via Atlassian skill.
---

# `/daily-status-report`

Project/team status report (broader than personal `/start-day`).

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-status-report/SKILL.md`
3. Stack data skill (jira-bitbucket or github)
4. [agents/subagent-orchestration.md](../agents/subagent-orchestration.md)

## Subagents (required)

1. **Task → exploration** — issues/PRs updated in window; blockers; merges.
2. **Task → execution** — formatted report (`--audience`).
3. **Task → verification** — scope and facts check.

## Arguments

| Arg | Default | Description |
|-----|---------|-------------|
| `--days=1` | 1 | Lookback days |
| `--audience=team` | team | `team`, `lead`, `executive` |
| `--confluence` | off | Atlassian: offer Confluence publish via generate-status-report skill |

## Safety

- Draft in chat first.
- Confluence/Jira publish only with explicit user approval.
- Read-only MCP until approved.

## Examples

```text
/daily-status-report
/daily-status-report --days=7 --audience=lead
/daily-status-report --confluence
```
