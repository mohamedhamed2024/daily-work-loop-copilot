# How Daily Work Loop Copilot works

**Start here for demos and onboarding.** Install steps: [install.md](./install.md). Pilot testing: [../tests/README.md](../tests/README.md).

## Your day in four moves

```text
Morning     /start-day          → brief, top priorities, first action
Anytime     /my-queue           → full ranked queue
            /next-task          → one best next step
Evening     /eod-wrap           → summary + draft issue comments + open loops
Before PTO  /handoff [dates]    → handoff pack for your team
Optional    /daily-status-report → team status (optional HTML for GitHub Pages)
```

Set **`INTEGRATION_STACK`** to `github` or `atlassian` so the agent reads the right issues and PRs. See [../mcp/integration-stacks.md](../mcp/integration-stacks.md).

## What you type vs what runs automatically

| You | Automatic |
|-----|-----------|
| Slash commands above | **Guardrails** (three hooks) — nudge or block unsafe actions |
| Say `APPROVE_GITHUB_WRITE` (or `APPROVE_WORK_ITEM_WRITE`) when you want a real post | **Write lock** blocks Jira/GitHub MCP posts until approval file exists |
| Link work in commits (`Fixes #42` or `PROJ-123`) | **Link nudge** warns if a commit has no link |
| Close Cursor after coding | **EOD reminder** suggests `/eod-wrap` once (advisory) |

Guardrail details: [../hooks/README.md](../hooks/README.md).

## Policy (always on)

1. **Drafts first** — ticket/issue comments stay in chat until you approve.
2. **No auto-merge / auto-close** — you act in GitHub, Jira, or Bitbucket UI.
3. **Link your work** — GitHub: `#N` / `Fixes #N`; Atlassian: `PROJ-123`.
4. **Repo wins conflicts** — your app repo `AGENTS.md` beats default command behavior when they disagree.

Full policy: [../rules/daily-loop-policy.mdc](../rules/daily-loop-policy.mdc). Plain English: [../rules/README.md](../rules/README.md).

## Behind the scenes: Gather → Draft → Check

You do not need to run these; the main agent does when you use a command.

| Step | Also called (internal) | What it does |
|------|------------------------|--------------|
| **Gather** | `daily-loop-exploration` | Loads issues, PRs, CI, git; builds ranked queue + confidence. |
| **Draft** | `daily-loop-execution` | Formats brief, EOD, handoff, or status report from Gather output. |
| **Check** | Parent agent (not a separate Task) | For `/eod-wrap` and `/handoff` only: PASS/FAIL on open loops and sections. |

| Command | Gather | Draft | Check |
|---------|--------|-------|-------|
| `/my-queue`, `/next-task` | Yes | No (parent summarizes) | No |
| `/start-day`, `/daily-status-report` | Yes | Yes | No |
| `/eod-wrap`, `/handoff` | Yes | Yes | Yes (parent) |

Checklist: [../agents/verification.md](../agents/verification.md). Orchestration: [../agents/subagent-orchestration.md](../agents/subagent-orchestration.md).

## Data sources (MCP)

| Server | Role |
|--------|------|
| **GitHub** or **Atlassian** plugin | Live issues, PRs, checks (sign in once in Cursor). |
| **daily-loop-tools** (bundled) | Command docs and status-report plans — optional for day-to-day use. |

Security: [../mcp/security-and-auth.md](../mcp/security-and-auth.md).

## Stale reviews and failing CI

Not a hook. They show up in `/start-day` blockers and `/my-queue --filter=blocked` using **`STALE_REVIEW_DAYS`** in plugin Configure.
