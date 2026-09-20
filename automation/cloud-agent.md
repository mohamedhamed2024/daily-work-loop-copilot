# Automation — cloud agent tier

**Adopted:** No (MVP)

## Decision (2026-09-19)

Out of scope: long PTO handoff prep across many repositories in one cloud agent run.

## If adopted later

- Trigger: user request before extended PTO
- Scope: read-only MCP across allowlisted repos
- Output: consolidated handoff markdown for human edit
- Credentials: per-user Atlassian MCP; no shared service accounts

## Rollback

Disable cloud agent job template; fall back to per-repo `/handoff`.
