# MCP write gate hook

Blocks **Atlassian** and **GitHub** MCP mutation tools unless the approval file is present.

## Implementation

| Event | Handler |
|-------|---------|
| `beforeMCPExecution` | [scripts/jira-write-gate.sh](./scripts/jira-write-gate.sh) (`failClosed: true`) |

## Trigger

- Atlassian: tool names matching comment, create, update, edit, transition, delete, merge, approve, decline, or assign
- GitHub: `issue_write`, `sub_issue_write`, `add_issue_comment`, `merge_pull_request`, `pull_request_review_write`, `push_files`, `create_or_update_file`, `create_pull_request`, `update_pull_request`, `delete_file`, and the other mutation tools listed in the script

Read tools are not gated.

## Behavior

**Block** by default.

**Allow** when `.cursor/daily-loop-write-approved` exists in the workspace, or `DAILY_LOOP_JIRA_WRITE_APPROVED=1` (dev only). The script checks the file, not the chat text.

`APPROVE_WORK_ITEM_WRITE`, `APPROVE_JIRA_WRITE`, and `APPROVE_GITHUB_WRITE` are the user phrases that tell the agent to create that file and post. Remove the file after the approved post.

## Related

- [mcp/security-and-auth.md](../mcp/security-and-auth.md)
- `rules/daily-loop-write-safety.mdc`
