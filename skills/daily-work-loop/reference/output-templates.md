# Output templates — Daily Work Loop Copilot

Use these structures in command responses. Replace placeholders; do not invent issue keys or PR IDs.

## Morning brief (`/start-day`)

```markdown
## Morning brief — {date}

**Meetings / calendar:** {meetings_or_skip}

**Blockers:** {blockers_or_none}

**Top 3 priorities**
1. {item} — {one_line_why}
2. {item}
3. {item}

**Suggested first action:** {single_action_with_links}

**Optional standup draft**
- Yesterday: …
- Today: …
- Blockers: …
```

## Queue row (`/my-queue`)

```markdown
| Rank | Score | Type | Item | Why now |
|------|-------|------|------|---------|
| 1 | 185 | PR review | {repo}#{id} | Blocks {JIRA-KEY}; waiting {N}d |
```

## Next task (`/next-task`)

```markdown
## Next task

**Do this:** {action}

**Because:** {ranking_rationale}

**Links:** {jira_url} · {pr_url}

**If blocked:** {fallback}
```

## EOD wrap (`/eod-wrap`)

```markdown
## EOD — {date}

### Shipped
- …

### In progress
- …

### Blocked
- …

### Draft Jira comments (not posted)
#### {JIRA-KEY} — {summary}
{comment_body}

### Open loops
| Loop | Owner | Next step | By when |
|------|-------|-----------|---------|
```

## Handoff (`/handoff`)

```markdown
# Handoff — {user} — {date_range}

## Coverage
{who_covers_what}

## Open PRs
| PR | Status | Risk | Action for cover |
|----|--------|------|------------------|

## Jira in flight
| Key | Status | Notes |

## Risks and escalations
| Risk | Contact | When to escalate |

## Open loops
| Item | Owner | Next step | Date |

## Verification
- [ ] All open loops have owner and date
- [ ] Escalation contacts listed
- [ ] No unapproved Jira writes pending
```
