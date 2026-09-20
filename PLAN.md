# Daily Work Loop Copilot — Implementation Plan

**Area:** Day-to-day engineering productivity  
**Complexity:** Medium  
**Ranking:** ⭐⭐⭐⭐⭐  
**Q3 Coverage:** **9/9 goals**  
**Status:** MVP implemented (0.1.0) — pilot ready  
**MVP timeline:** 2–3 weeks  

---

## Executive summary

**Daily Work Loop Copilot** is an AI-assisted daily workflow that helps developers **start the day with clear priorities**, **stay focused on the right work**, and **close the day with updated tickets and clean handoffs**.

It combines two complementary daily pain points:

| Phase | Problem | Solution |
|---|---|---|
| **Start of day** | Too much time deciding what to work on across work items, PRs, reviews, and CI | `/start-day`, `/my-queue`, `/next-task` |
| **End of day / handoff** | Forgotten ticket updates, undocumented open loops, weak PTO handoffs | `/eod-wrap`, `/handoff` |

```text
Morning (/start-day)
        ↓
Work Queue (/my-queue → /next-task)
        ↓
During day (hooks + MCP refresh)
        ↓
Evening (/eod-wrap)
        ↓
PTO / absence (/handoff → verify)
```

---

## Problem statement

Developers lose time at **both ends** of the day:

### Morning friction

- Checking work items, PRs, reviews, and CI before real work begins
- Deciding what to do first without a single prioritized view
- Missing blockers until standup or later in the day
- High context switching before meaningful progress

### End-of-day leakage

- Commits and PR activity without corresponding work-item updates
- Open loops left undocumented overnight or over the weekend
- Weak handoffs before PTO ("ask Ahmed" instead of a structured doc)
- Monday surprises for the team and tech leads

These steps are repetitive, easy to skip, and hard to measure — but they directly affect delivery visibility, review flow, and team continuity.

---

## Proposed solution

Build a **Daily Work Loop Copilot** as an installable agent plugin that:

1. **Starts the day** — pulls work items, PRs, reviews, CI, and blockers into one ranked queue
2. **Guides execution** — recommends the next best task with links and context
3. **Closes the day** — drafts ticket updates from commits/PRs and lists open loops
4. **Hands off cleanly** — generates a verifiable handoff pack before PTO or absence

### How AI is used

AI can:

- Aggregate signals from Git, work items, and CI
- Rank work by urgency, dependency, and team-defined rules
- Draft standup, EOD, and handoff summaries in a consistent format
- Detect gaps (unlinked commits, stale reviews, untracked work)
- Verify completeness before marking a day closed or handoff ready

### Main features

- Unified daily work queue
- "Next task" recommendation
- Morning brief and optional standup draft
- End-of-day wrap with draft ticket comments
- PTO / absence handoff document
- Three guardrail hooks for commonly forgotten steps
- Five parameterized commands
- GitHub or Azure DevOps MCP integration
- Exploration, execution, and verification sub-agents
- Installable plugin and standardized `AGENTS.md`

---

## Day-in-the-life example

```text
08:30  /start-day
       → "Review PR #412 (blocks your task), then continue WI-8842"

10:00  /next-task
       → "Finish WI-8842 — CI green, 1 file left"

17:30  /eod-wrap
       → Draft comments on WI-8842, WI-8801; 1 open loop: PR #412 waiting on Alex

Sep 14  /handoff Sep 15–22
       → Handoff.md: 2 open PRs, 1 blocked item, escalation contacts
```

---

## Full Q3 goal implementation

### Goal 2 — Durable reusable skill

Create:

```text
skills/daily-work-loop/SKILL.md
```

The skill defines:

1. **Morning flow** — data sources, ranking rules, output format
2. **Execution flow** — how to pick and refine the next task
3. **EOD flow** — what to summarize and what to update
4. **Handoff flow** — required sections and escalation rules
5. **Constraints** — no auto-close tickets, no auto-merge, human approves all writes
6. **Verification** — completeness checks before "day closed" or "handoff ready"
7. Links to engineering standards and work-item conventions

---

### Goal 3 — Three guardrail hooks

1. **Unlinked Work Hook** (morning + during day)  
   Warns when recent commits or open PRs have no linked work item.

2. **Stale Attention Hook** (during day)  
   Warns when a high-priority item is blocked only by you (e.g. PR review waiting > 2 days, failing CI you own).

3. **Open Loop Hook** (end of day)  
   Warns before session end if there are commits/PR activity today but no work-item update, or open loops without owner/next step.

Each hook documents: trigger, warn vs block behavior, failure message, and test cases.

---

### Goal 4 — Five commands

| Command | When | What it does |
|---|---|---|
| `/start-day` | Morning | Brief: meetings, blockers, top 3 priorities, suggested first action |
| `/my-queue` | Anytime | Full ranked queue from work items, PRs, reviews, and CI |
| `/next-task` | During day | Single best next action with context and links |
| `/eod-wrap` | End of day | Shipped / in progress / blocked + draft ticket comments |
| `/handoff [dates]` | Before PTO | Handoff doc: open PRs, risks, contacts, open loops + verify |

**Usage examples:**

```text
/start-day
/my-queue --filter=blocked
/next-task
/eod-wrap --update-tickets draft
/handoff 2026-09-15..2026-09-22
```

Each command includes: arguments, defaults, usage examples, and safety notes (draft-only writes until approved).

---

### Goal 5 — Rule cleanup

Audit and consolidate overlapping rules for:

- Standup format
- Work-item update expectations
- PR and review SLAs
- Handoff requirements

Create a precedence model:

```text
Organization policy
    ↓
Repository AGENTS.md
    ↓
daily-work-loop skill
    ↓
Task-specific command
```

Move long "how to start/end your day" procedures out of duplicated user rules and into the reusable skill.

---

### Goal 6 — MCP integration

Connect safely to one system of record (GitHub or Azure DevOps):

```text
get_my_work_items
get_pull_requests          # authored + assigned reviews
get_pr_comments
get_ci_status
get_commits                # today / since last EOD
update_work_item_comment   # draft or approved write
get_team_calendar          # optional, for /start-day
```

Document:

- Authentication and permissions
- Read vs write boundaries
- Error handling
- Security review
- One successful end-to-end workflow: `/start-day` → work → `/eod-wrap` with ticket draft

---

### Goal 7 — Three focused sub-agents

**Exploration Agent**

- Gathers work items, PRs, CI, commits, and optional calendar
- Builds the ranked queue and detects blockers
- Required inputs: user identity, repo scope, date range
- Stop condition: queue assembled with confidence scores

**Execution Agent**

- Drafts standup, next-task rationale, EOD summary, and handoff doc
- Proposes ticket comment updates from activity
- Stop condition: drafts ready for human review

**Verification Agent**

- Checks queue completeness, EOD coverage, and handoff readiness
- Fails if open loops lack owner/date or writes would violate policy
- Escalates ambiguous priority conflicts to the human

---

### Goal 8 — Automation tiers

Document separately:

| Tier | Use | Trigger | Adopted? |
|---|---|---|---|
| **Cursor / local** | `/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff` | Developer | Yes |
| **Routine / scheduled** | Morning queue digest; EOD reminder if commits but no wrap | Optional schedule | TBD |
| **CI** | Schema tests for queue ranking config; MCP contract tests | On PR | Yes |
| **Cloud agent** | Long PTO handoff prep across many repos | On request | TBD |

For each adopted tier document: trigger, scope, credentials, MCP usage, review path, monitoring, rollback.

Unused tiers should have a dated out-of-scope decision.

---

### Goal 9 — Installable plugin

Package:

```text
daily-work-loop-copilot/
├── manifest
├── skills/
│   └── daily-work-loop/
│       └── SKILL.md
├── commands/
│   ├── start-day
│   ├── my-queue
│   ├── next-task
│   ├── eod-wrap
│   └── handoff
├── hooks/
│   ├── unlinked-work
│   ├── stale-attention
│   └── open-loop
├── agents/
│   ├── exploration
│   ├── execution
│   └── verification
├── rules/
│   └── precedence.md
├── mcp/
│   ├── github-or-ado-tools
│   └── security-and-auth.md
├── automation/
│   ├── cursor.md
│   ├── routine.md
│   ├── ci.md
│   └── cloud-agent.md
├── plugin/
│   ├── install.md
│   ├── uninstall.md
│   └── data-handling.md
└── tests/
    └── clean-install-and-e2e
```

Include: versioning, data-handling notes, security/license checklist, and clean-install test.

---

### Goal 10 — AGENTS.md

Add clear repository entry points documenting:

- How the `daily-work-loop` skill is loaded
- Available commands and when to use each
- Hook behavior (especially EOD and unlinked work)
- MCP permissions and write-approval rules
- Work-item linking conventions
- Which repo owns cross-cutting daily automation
- Multi-repo guidance

---

## Expected value and impact

| Area | Expected impact |
|---|---|
| **Productivity** | Less time deciding what to work on; faster start each morning |
| **Visibility** | More accurate, timely work-item status for leads and stakeholders |
| **Flow** | Fewer stale PRs and forgotten blockers |
| **Continuity** | Better handoffs before PTO or role changes |
| **Consistency** | Standardized daily rhythm across the team |
| **Q3 goals** | Delivers full artifact set in one focused, reusable package |

### Measurement (KPIs)

| KPI | Target |
|---|---:|
| Morning planning overhead | ↓ 50%+ |
| Work items updated same day as code activity | ↑ 40%+ |
| Forgotten handoff items before PTO | ↓ 60%+ |
| Stale PRs (> 2 days, owned by user) | ↓ 30% |
| Useful AI suggestions (next task / EOD) | > 70% |
| Daily command adoption | Track per dev/week |
| Reusable skill | 1 |
| Guardrails | 3 |
| Commands | 5 |
| Sub-agents | 3 |
| MCP integrations | 1+ |
| Installable plugin | 1 |

---

## MVP plan (2–3 weeks)

### Week 1 — Morning loop

- [ ] Create `skills/daily-work-loop/SKILL.md`
- [ ] Implement MCP read tools: work items, PRs, CI, commits
- [ ] Build `/start-day` and `/my-queue`
- [ ] Define queue ranking rules (configurable)
- [ ] Draft `AGENTS.md` template

### Week 2 — Close the loop

- [ ] Build `/next-task` and `/eod-wrap`
- [ ] Implement 3 guardrail hooks
- [ ] Define exploration and verification agent profiles
- [ ] Draft ticket comment updates (human approval required)
- [ ] Document automation tiers

### Week 3 — Handoff and packaging

- [ ] Build `/handoff` with verification step
- [ ] Package installable plugin
- [ ] Rule cleanup and precedence doc
- [ ] Clean-install and end-to-end test on one pilot repo
- [ ] Pilot with one team; collect baseline metrics

### Out of scope for MVP

- Auto-posting to Teams or Slack
- Auto-applying ticket updates without human approval
- Multi-repo org-wide dashboard
- Complex ML-based priority ranking (use transparent rule-based ranking first)

---

## Pilot proposal

| Item | Detail |
|---|---|
| **Duration** | 2–3 weeks |
| **Audience** | One engineering team |
| **Integration** | Existing Git + work-item stack (GitHub or Azure DevOps) |
| **Write policy** | Draft-only ticket updates; human approves before post |
| **Success criteria** | Measurable reduction in planning overhead and improved same-day ticket updates |

### Ask

Approval to proceed with MVP on one team, measure time saved and ticket-update consistency, then decide on wider rollout.

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Wrong priority recommendations | Transparent ranking rules; human always overrides via `/next-task` |
| Over-automation of ticket updates | Draft-only writes; explicit approval step |
| MCP auth or permission issues | Start read-only; document scopes; security review before writes |
| Low adoption | Keep to 5 simple commands; integrate into existing daily standup/EOD habit |
| Noisy hooks | Tune thresholds per team; warn before block |

---

## Q3 goal coverage

| Goal | Deliverable | Status |
|---|---|---|
| **G2** Skill | `skills/daily-work-loop/SKILL.md` (+ focused skills) | Done |
| **G3** Hooks | Unlinked work, stale attention, open loop (+ write gate) | Done |
| **G4** Commands | start-day, my-queue, next-task, eod-wrap, handoff | Done |
| **G5** Rules | Precedence model + cleanup | Done |
| **G6** MCP | Atlassian Jira + Bitbucket | Done |
| **G7** Agents | Exploration, execution, verification | Done |
| **G8** Tiers | Cursor, routine, CI, cloud agent docs | Done |
| **G9** Plugin | `daily-work-loop-copilot` package | Done |
| **G10** AGENTS.md | Per-repo entry points | Done |
| **Coverage** | | **9/9** |

---

## Manager summary (email-ready)

**Subject:** Proposal: Daily Work Loop Copilot — automate start-of-day prioritization and end-of-day closure

**One-liner:** An AI-assisted daily workflow that helps developers start the day with clear priorities and close the day with updated tickets and clean handoffs.

**Problem:** Developers spend significant time each morning figuring out what to work on, and often skip end-of-day ticket updates and PTO handoffs — leading to stale boards, delayed reviews, and poor team continuity.

**Solution:** A reusable plugin with five commands (`/start-day`, `/my-queue`, `/next-task`, `/eod-wrap`, `/handoff`) integrated with our Git and work-item tools, plus guardrails for commonly forgotten steps.

**Expected benefits:** Faster morning start, better delivery visibility, fewer stale PRs, cleaner PTO handoffs, and full alignment with Q3 AI upskilling deliverables.

**Ask:** Approve a 2–3 week MVP pilot on one team before wider rollout.

---

*Document created: September 10, 2026*
