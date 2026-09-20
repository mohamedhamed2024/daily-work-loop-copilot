# MCP write gate hook

Blocks **Atlassian** and **GitHub** MCP mutation tools unless write approval is recorded.

## Implementation

| Event | Handler |
|-------|---------|
| `beforeMCPExecution` | [scripts/jira-write-gate.sh](./scripts/jira-write-gate.sh) (`failClosed: true`) |

## Trigger

- Atlassian: tools matching create/update/comment/transition/merge patterns
- GitHub: `issue_write`, `add_issue_comment`, `merge_pull_request`, `pull_request_review_write`, etc.

## Behavior

**Block** by default.

**Allow** when `.cursor/daily-loop-write-approved` exists in workspace, or `DAILY_LOOP_JIRA_WRITE_APPROVED=1` (dev only).

User consent phrases: **`APPROVE_WORK_ITEM_WRITE`**, `APPROVE_JIRA_WRITE`, or `APPROVE_GITHUB_WRITE`.

## Related

- [mcp/security-and-auth.md](../mcp/security-and-auth.md)
- `rules/daily-loop-write-safety.mdc`
