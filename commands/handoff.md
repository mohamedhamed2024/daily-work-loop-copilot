---
name: handoff
description: Generate a PTO or absence handoff pack with open PRs, Jira, risks, contacts, and verification.
---

# `/handoff [dates]`

Structured handoff before PTO or extended absence.

## Load

1. `skills/daily-work-loop/SKILL.md`
2. `skills/daily-handoff/SKILL.md`
3. Stack data skill per `INTEGRATION_STACK`
4. Rule: `rules/handoff-requirements.mdc`
5. `agents/subagent-orchestration.md`

## Subagents (required)

**Task exploration** → **Task execution** → **Task verification**.

## Arguments

| Arg | Required | Description |
|-----|----------|-------------|
| Date range | Yes | `2026-09-15..2026-09-22` or natural language dates |
| `--output=path` | No | Write markdown file only if user confirms path |

## Steps

1. Parse absence date range; ask once if missing.
2. **Exploration** subagent → all open PRs and in-flight work items.
3. **Execution** subagent → handoff template.
4. **Verification** subagent → handoff ready PASS/FAIL.
5. If FAIL, list fixes; regenerate sections after user input.

## Safety

Informational document only. No Jira/Bitbucket mutations in this command.

## Examples

```text
/handoff 2026-09-15..2026-09-22
/handoff Sep 15–22
```

## Verify step

End with verification block from `agents/verification.md`. Do not mark “handoff ready” on FAIL.
