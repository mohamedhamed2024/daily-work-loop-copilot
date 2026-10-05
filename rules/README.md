# Policy in plain English

The plugin enforces one **always-on** rule file: [daily-loop-policy.mdc](./daily-loop-policy.mdc).

1. **Drafts first** — EOD and handoff show comment text in chat; nothing posts to Jira/GitHub until you approve.
2. **Approve to post** — Say `APPROVE_GITHUB_WRITE` (or `APPROVE_WORK_ITEM_WRITE` / `APPROVE_JIRA_WRITE`); agent creates `.cursor/daily-loop-write-approved`; remove after one post.
3. **Link commits** — GitHub: `Fixes #N`. Atlassian: `PROJ-123`. Unlinked commits get a nudge (see [../hooks/README.md](../hooks/README.md)).
4. **No robots merging** — The agent never auto-merges PRs or closes issues for you.
5. **Your repo rules win** — If app repo `AGENTS.md` conflicts with a slash command default, follow `AGENTS.md` (after org policy).

## Precedence ladder (highest first)

1. Organization policy  
2. Repository **AGENTS.md**  
3. Plugin **policy** (`daily-loop-policy.mdc`)  
4. Orchestrator skill ([daily-work-loop](../skills/daily-work-loop/SKILL.md))  
5. Focused skills (`skills/*/SKILL.md`)  
6. Command file (`commands/*.md`)

Details: [precedence.md](./precedence.md).

## Other rule files

| File | Purpose |
|------|---------|
| [daily-loop-write-safety.mdc](./daily-loop-write-safety.mdc) | Short pointer to policy (legacy name) |
| [work-item-linking.mdc](./work-item-linking.mdc) | Stack-specific linking examples when agent loads it |

Overview: [../plugin/how-it-works.md](../plugin/how-it-works.md).
