# GitHub mirror

This project is hosted on **Cursor Origin** and mirrored to **GitHub** for team marketplace import and public distribution.

| Remote | URL |
|--------|-----|
| `origin` | `https://origin.cursor.com/integrant/daily-work-loop-copilot.git` |
| `github` | `https://github.com/Mohamed-Hamed_intdev/daily-work-loop-copilot.git` |

## One-time: create the GitHub repo (browser)

1. Open [github.com/new](https://github.com/new).
2. **Repository name:** `daily-work-loop-copilot`
3. **Public** (if your Enterprise Managed User policy allows; otherwise private).
4. Do **not** add README, `.gitignore`, or license (this repo already has them).
5. Create repository.

## Push from your machine

```bash
cd "/Users/mohamed.hamed/Desktop/AI Ideas/daily-work-loop-copilot"

# If github remote is missing:
git remote add github https://github.com/Mohamed-Hamed_intdev/daily-work-loop-copilot.git

git push -u github main
```

Authenticate with GitHub when prompted (browser or PAT).

## Keep both remotes in sync

```bash
git push origin main   # Cursor Origin
git push github main   # GitHub mirror
```

## Team marketplace

Import the **GitHub** URL in Dashboard → Plugins & MCPs → Team Marketplaces → Import from repo.

If GitHub is private, grant the Cursor GitHub App access to the repository.

## EMU note

Some Enterprise Managed User accounts cannot create **public** personal repositories via API. If github.com blocks public, use a private repo or ask an org admin to create `Integrantinc/daily-work-loop-copilot` and update the `github` remote URL.
