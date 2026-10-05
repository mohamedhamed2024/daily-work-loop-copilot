---
name: handoff
description: Generate a PTO or absence handoff pack with open PRs, in-flight work, risks, contacts, and verification.
---

# `/handoff [dates]`

Structured handoff before PTO or extended absence.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-handoff/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. `agents/subagent-orchestration.md`

## Subagents (Gather → Draft)

**Gather** → **Draft**; parent **Check** per [agents/verification.md](../agents/verification.md).

## Arguments

| Arg | Required | Description |
|-----|----------|-------------|
| Date range | Yes | `2026-09-15..2026-09-22` or natural language dates |
| `--output=path` | No | Write a markdown file only if the user confirms the path |

## Steps

1. Parse the absence date range; ask once if it is missing.
2. **Gather** → all open PRs and in-flight work items.
3. **Draft** → handoff template.
4. **Check** (parent) → handoff ready PASS/FAIL.
5. On FAIL, list fixes and regenerate sections after the user responds.

## Safety

Informational document only. No work-item or PR mutations in this command.

## Examples

```text
/handoff 2026-09-15..2026-09-22
/handoff Sep 15–22
```

## Verify step

Parent runs Check from `agents/verification.md`. Do not mark “handoff ready” on FAIL.
