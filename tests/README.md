# Testing Daily Work Loop Copilot

**Explain the product:** [plugin/how-it-works.md](../plugin/how-it-works.md)

| Guide | When |
|-------|------|
| [github-pilot-e2e.md](./github-pilot-e2e.md) | GitHub stack pilot on `mohamedhamed2024/MyHoppiesRootRepo` (~30–45 min) |
| [clean-install-and-e2e.md](./clean-install-and-e2e.md) | Short checklist for any pilot repo (Atlassian or GitHub) |

## GitHub pilot in three acts

| Act | Time | What you prove |
|-----|------|----------------|
| **1 — Your day** | ~15 min | Commands + Gather/Draft + Check on EOD |
| **2 — Guardrails + policy** | ~10 min | Link nudge, write lock, approve one comment |
| **3 — Optional depth** | ~20 min | Handoff, status HTML, stack mismatch |

## Seed data (GitHub pilot only)

From plugin repo root:

```bash
chmod +x tests/scripts/seed-github-pilot-fixtures.sh
tests/scripts/seed-github-pilot-fixtures.sh --dry-run
tests/scripts/seed-github-pilot-fixtures.sh --push
APP_REPO="/path/to/MyHoppiesRootRepo" tests/scripts/seed-github-pilot-fixtures.sh --push
tests/scripts/seed-github-pilot-fixtures.sh --cleanup --push
```

Requires `gh auth login`. PR branches need `--push`.

## Pass / fail

- **Pass:** Real issue and PR numbers from GitHub MCP (not invented); drafts stay in chat until approval; Check shows PASS or FAIL with clear fixes.
- **Fail:** Fabricated `#` keys, silent posts to GitHub without approval, or “handoff ready” when Check failed.
