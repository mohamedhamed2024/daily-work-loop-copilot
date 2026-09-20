# MCP — security and authentication

Choose one stack via **`INTEGRATION_STACK`**. See [integration-stacks.md](./integration-stacks.md).

## Atlassian stack (`INTEGRATION_STACK=atlassian`)

1. **Plugins → Atlassian** → Sign in (OAuth).
2. Namespace: `plugin-atlassian-atlassian`.
3. No API token in `.env` required for typical Cursor use.
4. [mcp.json](../mcp.json) does not duplicate the Rovo server.

Doc: [atlassian-bitbucket-jira.md](./atlassian-bitbucket-jira.md).

## GitHub stack (`INTEGRATION_STACK=github`)

1. **Plugins → GitHub** → connect / sign in to GitHub MCP.
2. Namespace: `plugin-github-github`.
3. No PAT in `.env` required when OAuth is handled by Cursor.
4. Configure `GITHUB_OWNER` and `GITHUB_REPO`.

Doc: [github-issues-prs.md](./github-issues-prs.md).

## Bundled MCP: daily-loop-tools

Read-only plugin server ([daily-loop-tools.md](./daily-loop-tools.md)) — command specs, subagent prompts, status report plans. Requires Node.js.

## Read vs write boundaries (both stacks)

| Operation | MVP policy |
|-----------|------------|
| Issue/work item read | Allowed when MCP authenticated |
| PR read, checks read | Allowed |
| Issue comment / update / create | **Blocked** without approval |
| PR merge / approve | **Never** automated |

Approval: user says **`APPROVE_WORK_ITEM_WRITE`** (or `APPROVE_JIRA_WRITE` / `APPROVE_GITHUB_WRITE`) and `.cursor/daily-loop-write-approved` in the app repo.

## Enforcement

1. Skills + [rules/daily-loop-write-safety.mdc](../rules/daily-loop-write-safety.mdc)
2. [hooks/scripts/jira-write-gate.sh](../hooks/scripts/jira-write-gate.sh) on `beforeMCPExecution` (Atlassian + GitHub mutation tools)

## Config

Non-secret values in **Plugins → Configure** or [`.env.example`](../.env.example) — [config/env.md](../config/env.md).

## Pilot checklist

- [ ] Correct stack plugin installed and signed in per developer
- [ ] `INTEGRATION_STACK` matches repo remote (Bitbucket+Jira vs GitHub)
- [ ] Write gate enabled
- [ ] Draft-only default understood by team
