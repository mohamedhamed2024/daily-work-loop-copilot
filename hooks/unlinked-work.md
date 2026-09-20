# Unlinked work hook

Warn when commits lack a linked work item (Jira key or GitHub issue ref).

## Implementation

| Event | Handler |
|-------|---------|
| `afterShellExecution` | [scripts/check-unlinked-commit.sh](./scripts/check-unlinked-commit.sh) (matcher: `git commit`) |

## Linking standard

| Stack | Examples |
|-------|----------|
| Atlassian | `PROJ-123` in commit / branch / PR |
| GitHub | `#42`, `Fixes #42`, `owner/repo#42` |

See `rules/work-item-linking.mdc`.

## User message

> Daily Work Loop (unlinked work): Latest commit has no Jira key (PROJ-123) or GitHub issue ref (#42 / Fixes #42).

## Test cases

1. `git commit -m "fix typo"` → warn.
2. `git commit -m "PROJ-123 …"` or `Fixes #12` → no warn.
