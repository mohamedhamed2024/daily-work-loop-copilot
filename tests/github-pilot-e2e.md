# GitHub pilot E2E — MyHoppiesRootRepo

Target: [mohamedhamed2024/MyHoppiesRootRepo](https://github.com/mohamedhamed2024/MyHoppiesRootRepo)  
Stack: `INTEGRATION_STACK=github`, `GITHUB_OWNER=mohamedhamed2024`, `GITHUB_REPO=MyHoppiesRootRepo`

Read first: [plugin/how-it-works.md](../plugin/how-it-works.md)

## Before you start

- [ ] Open **MyHoppiesRootRepo** as the Cursor workspace (not the plugin repo).
- [ ] GitHub Cursor plugin signed in.
- [ ] Daily Work Loop plugin installed; Configure as above; `STALE_REVIEW_DAYS=0` for this run (restore `2` after).
- [ ] `DAILY_REPORT_HTML_PATH=docs/index.html`
- [ ] Delete `.cursor/daily-loop-write-approved` if present (do not commit it).
- [ ] Add daily-loop snippet to app `AGENTS.md` ([plugin/install.md](../plugin/install.md)).
- [ ] Node 18+ for bundled MCP.

### Fixture map (fill after seed)

| Fixture | Number |
|---------|--------|
| In-progress issue | #____ |
| Blocked issue | #____ |
| Linked PR | #____ |
| Fail-CI PR | #____ |

```bash
cd /path/to/daily-work-loop-copilot
chmod +x tests/scripts/seed-github-pilot-fixtures.sh
tests/scripts/seed-github-pilot-fixtures.sh --push
```

---

## Act 1 — Your day (~15 min)

Goal: commands work with real GitHub data; **Gather → Draft → Check** on EOD.

| Step | Do this | Pass |
|------|---------|------|
| 1.1 | `/start-day` | Morning brief; top 3; first action; **high** confidence; real `#` / PRs from seed |
| 1.2 | `/start-day --standup` | Yesterday / Today / Blockers lines |
| 1.3 | `/start-day --focus=#<in-progress>` | Focus issue ranked up |
| 1.4 | `/my-queue` | Scored table, `why now`, unlinked list if any |
| 1.5 | `/my-queue --filter=blocked` | Blocked issue + fail-CI PR appear |
| 1.6 | `/my-queue --filter=in_progress` | In-progress issue + linked PR |
| 1.7 | `/next-task` | One card with links |
| 1.8 | `/next-task --skip-reviews` | Prefers non-review work when possible |
| 1.9 | `/eod-wrap` | Shipped / In progress / Blocked; **draft** issue comments; open loops; **## Verification — PASS \| FAIL** from parent **Check** (not a third Task) |

**Gather check:** For 1.4–1.8, agent should use GitHub MCP — no invented issue numbers.

**Calendar:** `/start-day` may say “Calendar not available” (expected).

---

## Act 2 — Guardrails + policy (~10 min)

Goal: three guardrails match [hooks/README.md](../hooks/README.md) and [rules/daily-loop-policy.mdc](../rules/daily-loop-policy.mdc).

| Step | Do this | Pass |
|------|---------|------|
| 2.1 | `git commit -m "fix typo"` (allow-empty ok) | **Link nudge** on stderr |
| 2.2 | `git commit -m "Fixes #<in-progress> pilot update"` | No nudge |
| 2.3 | Ask agent to post an issue comment via GitHub MCP **without** approval file | **Write lock** denies |
| 2.4 | Message includes `APPROVE_GITHUB_WRITE`; agent creates `.cursor/daily-loop-write-approved` | File exists |
| 2.5 | `/eod-wrap --update-tickets approved` (same message) | **One** comment posted; file removed after |
| 2.6 | End session after commits **without** `/eod-wrap` | **EOD reminder** (one sentence); then run `/eod-wrap` and end again — no reminder |

Optional precedence test: add to app `AGENTS.md`: “For daily loop, always prefer `/next-task --skip-reviews`.” Run `/next-task` without flag — behavior should follow **AGENTS.md** ([rules/precedence.md](../rules/precedence.md)).

---

## Act 3 — Optional depth (~20 min)

| Step | Do this | Pass |
|------|---------|------|
| 3.1 | `/handoff 2026-10-01..2026-10-08` | Coverage, PRs, in flight, risks, open loops; Check PASS/FAIL |
| 3.2 | `/daily-status-report` | Real activity in window |
| 3.3 | `/daily-status-report --days=7 --audience=lead` | Wider window / tone |
| 3.4 | `/daily-status-report --publish=html` | `docs/index.html`; **Last synced**; meta `daily-loop-last-sync` |
| 3.5 | Push HTML; GitHub Pages from `/docs` if enabled | `https://mohamedhamed2024.github.io/MyHoppiesRootRepo/` |
| 3.6 | Ask agent to call `list_daily_loop_commands` (daily-loop-tools) | Six commands listed |
| 3.7 | Set `INTEGRATION_STACK=atlassian` once, run `/my-queue`, then set `github` | Mismatch visible; fixed config restores data |

`--confluence` on GitHub stack: not used (Atlassian-only).

---

## Cleanup

```bash
tests/scripts/seed-github-pilot-fixtures.sh --cleanup --push
```

Restore `STALE_REVIEW_DAYS=2`. Optional: [plugin/uninstall.md](../plugin/uninstall.md) drill.

## Sign-off

| Act | Pass | Tester | Date |
|-----|------|--------|------|
| 1 | | | |
| 2 | | | |
| 3 (optional) | | | |
