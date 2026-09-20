# Clean install and E2E checklist

Validate MVP on one **pilot application repo** after installing this plugin.

Set **`INTEGRATION_STACK`** to match the repo: **Atlassian** (Jira + Bitbucket) or **GitHub** (Issues + PRs).

## Prerequisites

- [ ] Daily Work Loop Copilot plugin installed
- [ ] **`INTEGRATION_STACK`** set in Configure
- [ ] **Atlassian** plugin signed in (`atlassian`) **or** **GitHub** plugin signed in (`github`)
- [ ] Stack-specific vars: `JIRA_PROJECT_KEYS` + `BITBUCKET_WORKSPACE` **or** `GITHUB_OWNER` + `GITHUB_REPO`
- [ ] Pilot repo cloned; git remote matches stack

## 1. Morning loop

- [ ] Run `/start-day` in Agent chat
- [ ] Response includes morning brief, top 3, suggested first action
- [ ] Queue confidence stated (high if MCP OK)
- [ ] Run `/my-queue` — table with scores and `why now`
- [ ] Run `/next-task` — single action with links

**Pass criteria:** Real work items or PRs from MCP (not fabricated); if MCP fails, low confidence + git-only explanation.

## 2. Linking and hooks

- [ ] Commit without link → unlinked-work warning
- [ ] Atlassian: commit with `PROJ-123` → no warn
- [ ] GitHub: commit with `Fixes #N` → no warn



## 3. EOD loop

- [ ] Make a small commit with valid Jira key
- [ ] Run `/eod-wrap`
- [ ] Output includes Shipped / In progress / Blocked sections
- [ ] **Draft Jira comments** present; confirm **nothing posted** to Jira without approval
- [ ] Verification PASS or FAIL with clear fixes for open loops



## 4. Write gate (optional)

- [ ] Without approval file, Jira comment MCP call is **denied** by hook
- [ ] User says `APPROVE_JIRA_WRITE`; agent creates `.cursor/daily-loop-write-approved`
- [ ] Re-run approved comment post once; remove approval file after



## 5. Handoff

- [ ] Run `/handoff YYYY-MM-DD..YYYY-MM-DD` with real absence dates
- [ ] Document includes coverage, open PRs, Jira in flight, risks, open loops
- [ ] Verification agent reports PASS when sections complete



## 6. Regression

- [ ] [plugin/uninstall.md](../plugin/uninstall.md) steps documented for rollback drill



## Sign-off


| Role      | Name | Date | Pass |
| --------- | ---- | ---- | ---- |
| Pilot dev |      |      |      |
| Tech lead |      |      |      |


Record baseline metrics from [PLAN.md](../PLAN.md) KPIs after 2–3 week pilot.