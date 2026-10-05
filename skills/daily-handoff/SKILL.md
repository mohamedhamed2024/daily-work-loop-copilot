---
name: daily-handoff
description: >-
  Builds a verifiable PTO or absence handoff from open PRs, in-flight work items, risks, contacts, and open loops. Use for /handoff and parent Check handoff-ready rules.
---

# Daily handoff

## Arguments

```text
/handoff 2026-09-15..2026-09-22
/handoff Sep 15–22
```

Default date range: ask user if missing.

## Required sections

1. **Coverage** — Who covers which areas/repos; timezone notes if relevant.
2. **Open PRs** — Table: PR, status, risk, action for cover.
3. **Work in flight** — Jira keys or GitHub issues, status, and what “done” looks like.
4. **Risks and escalations** — Who to ping and when.
5. **Open loops** — Same table as EOD; must be complete for Check pass.
6. **Verification checklist** — Copy from template; mark pass/fail.

Template: [../daily-work-loop/reference/output-templates.md](../daily-work-loop/reference/output-templates.md).

## Data sources

Use the stack data skill (`jira-bitbucket-daily-data` or `github-daily-data`) and `daily-loop-exploration` for the full open PR and work-item set (not only today’s activity).

## Check (handoff ready)

Parent Check fails if:

- Any open loop lacks owner, next step, or date
- Open PR with failing CI has no documented mitigation
- No escalation contact for a high-priority blocked work item

Pass: emit “Handoff ready” with checklist all checked or explicit user waivers.

## Output file (optional)

Offer to write `handoff-{start}-{end}.md` in repo docs folder **only if user asks**; default is chat markdown.

## Safety

Handoff doc is informational only; no automatic Jira/Bitbucket mutations.
