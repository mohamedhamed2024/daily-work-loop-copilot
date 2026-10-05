#!/usr/bin/env bash
# Blocks Atlassian and GitHub MCP mutation tools unless write approval file exists in workspace.
set -euo pipefail
export HOOK_INPUT
HOOK_INPUT=$(cat)

python3 <<'PY'
import json, os, re, sys

raw = os.environ.get("HOOK_INPUT", "")
try:
    data = json.loads(raw) if raw else {}
except json.JSONDecodeError:
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

server = (data.get("mcp_server_name") or "").lower()
url = (data.get("url") or data.get("mcp_server_url") or "").lower()
tool = (data.get("tool_name") or "").lower()

is_atlassian = "atlassian" in server or "atlassian.com" in url
is_github = "github" in server or "github.com" in url

atlassian_write = re.compile(
    r"(comment|create|update|edit|transition|delete|merge|approve|decline|assign)",
    re.I,
)
github_write = re.compile(
    r"(issue_write|sub_issue_write|add_issue_comment|add_comment_to_pending_review|add_reply_to_pull_request_comment|merge_pull_request|pull_request_review_write|push_files|create_or_update_file|create_pull_request|create_branch|create_repository|delete_file|fork_repository|update_issue_comment|update_pull_request|request_copilot_review)",
    re.I,
)

needs_gate = (is_atlassian and atlassian_write.search(tool)) or (
    is_github and github_write.search(tool)
)

if needs_gate:
    approved = os.environ.get("DAILY_LOOP_JIRA_WRITE_APPROVED") == "1"
    if not approved:
        for root in os.environ.get("CURSOR_WORKSPACE_ROOTS", "").split(os.pathsep):
            if root and os.path.isfile(os.path.join(root, ".cursor", "daily-loop-write-approved")):
                approved = True
                break
    if not approved:
        print(json.dumps({
            "permission": "deny",
            "user_message": "Daily Work Loop: work-item/PR write blocked. The hook allows this call only when .cursor/daily-loop-write-approved exists. Say APPROVE_WORK_ITEM_WRITE (or APPROVE_JIRA_WRITE / APPROVE_GITHUB_WRITE) to create that file and post, or post manually.",
            "agent_message": "Do not call this MCP write tool. The write gate checks .cursor/daily-loop-write-approved only. Produce a draft in chat unless the user sent APPROVE_WORK_ITEM_WRITE (or APPROVE_JIRA_WRITE / APPROVE_GITHUB_WRITE) and that approval file exists."
        }))
        sys.exit(0)

print(json.dumps({"permission": "allow"}))
PY
