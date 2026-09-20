---
name: daily-handoff
description: >-
  Builds a verifiable PTO or absence handoff from open PRs, Jira work, risks, contacts,
  and open loops. Use for /handoff and verification agent handoff-ready checks.
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
3. **Jira in flight** — Keys, status, what “done” looks like.
4. **Risks and escalations** — Who to ping and when.
5. **Open loops** — Same table as EOD; must be complete for verification pass.
6. **Verification checklist** — Copy from template; mark pass/fail.

Template: [../daily-work-loop/reference/output-templates.md](../daily-work-loop/reference/output-templates.md).

## Data sources

Use `jira-bitbucket-daily-data` skill + exploration agent for full open PR/Jira set (not only today’s activity).

## Verification (handoff ready)

Fail verification if:

- Any open loop lacks owner or date
- Open PR with failing CI has no documented mitigation
- No escalation contact for high-priority blocked Jira

Pass: emit “Handoff ready” with checklist all checked or explicit user waivers.

## Output file (optional)

Offer to write `handoff-{start}-{end}.md` in repo docs folder **only if user asks**; default is chat markdown.

## Safety

Handoff doc is informational only; no automatic Jira/Bitbucket mutations.
