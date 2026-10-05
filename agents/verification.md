# Verification checklist (parent agent)

Use this after **Draft** output for `/eod-wrap` or `/handoff`. The **parent agent** runs this checklist — do **not** launch a separate verification Task.

Overview: [../plugin/how-it-works.md](../plugin/how-it-works.md).

## When to run Check

- After `/eod-wrap` draft is ready
- After `/handoff` document is ready

Do not gather new MCP data unless confirming a specific issue key exists.

## EOD checks

- [ ] Shipped / in progress / blocked sections present
- [ ] Every work-item link from today’s git commits appears in draft comments or an explained omission (Jira key on the Atlassian stack, `#123` / `Fixes #123` / `owner/repo#123` on the GitHub stack)
- [ ] Open loops table: each row has owner, next step, and date (or Check **FAIL**)
- [ ] No language implying a work item was updated unless an approval phrase was used and `.cursor/daily-loop-write-approved` was present for the post

## Handoff checks

- [ ] Coverage section names people or roles
- [ ] All open PRs listed with risk + cover action
- [ ] In-flight work items listed (Jira keys or GitHub issues)
- [ ] Escalation contacts for blocked/high-priority items
- [ ] Open loops complete (same as EOD)
- [ ] Checklist at bottom of doc all checked or user waived explicitly

## Policy checks

- [ ] No auto-close / auto-merge instructions
- [ ] Draft-only comments unless `APPROVE_WORK_ITEM_WRITE`, `APPROVE_JIRA_WRITE`, or `APPROVE_GITHUB_WRITE` was present and the approval file existed

## Output format

```markdown
## Verification — PASS | FAIL

**Failures**
- …

**Warnings**
- …

**Required user action**
- …
```

On FAIL, list minimal fixes; do not rewrite the full EOD or handoff (Draft agent output stands).

## Escalation

If Gather and Check disagree on priority, tell the **human** to choose; do not override ranking silently.
