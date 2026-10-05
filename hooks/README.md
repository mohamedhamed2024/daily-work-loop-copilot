# Guardrails (hooks)

Three automatic behaviors registered in [hooks.json](./hooks.json). Specs link to each file for testers.

| Guardrail | When it runs | What you see | Blocks? |
|-----------|--------------|--------------|---------|
| **Link nudge** | Right after `git commit` | Message if the commit message has no Jira key or GitHub `#issue` | No — warning only |
| **Write lock** | Before Jira/GitHub MCP **writes** (comments, issue update, merge, etc.) | Message if `.cursor/daily-loop-write-approved` is missing | Yes — call denied |
| **EOD reminder** | When you end a Composer session | One sentence to run `/eod-wrap` if you coded but did not wrap | No — advisory only |

## Link nudge

- Spec: [unlinked-work.md](./unlinked-work.md)
- Script: [scripts/check-unlinked-commit.sh](./scripts/check-unlinked-commit.sh)
- GitHub example: `Fixes #12` → no nudge. `fix typo` → nudge.

## Write lock

- Spec: [jira-write-gate.md](./jira-write-gate.md)
- Script: [scripts/jira-write-gate.sh](./scripts/jira-write-gate.sh)
- To post once: user message includes `APPROVE_WORK_ITEM_WRITE` (or `APPROVE_GITHUB_WRITE` / `APPROVE_JIRA_WRITE`); agent creates `.cursor/daily-loop-write-approved`; remove after post.

## EOD reminder

- Spec: [open-loop.md](./open-loop.md)
- Open-loop **completeness** (owner, next step, date) is checked in the **Check** step when you run `/eod-wrap` or `/handoff`, not by this reminder.

## Presenter summary

> Commits should link to work items. Posts to Jira/GitHub need explicit approval. Closing the IDE after coding? Wrap the day with `/eod-wrap`.

Overview: [../plugin/how-it-works.md](../plugin/how-it-works.md).
