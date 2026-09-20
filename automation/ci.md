# Automation — CI tier

**Adopted:** Partial — documentation only for MVP; workflow optional follow-up.

## Intended use

On pull requests to **this plugin repo**:

- Validate [config/queue-ranking.yaml](../config/queue-ranking.yaml) parses as YAML.
- Lint that required plugin paths exist (`skills/*/SKILL.md`, `hooks/hooks.json`, five commands).
- Optional: JSON schema check for `.cursor-plugin/plugin.json`.

## MVP status

No GitHub Actions workflow shipped in 0.1.0; add `.github/workflows/plugin-validate.yml` when the repo host supports CI.

## Rollback

N/A until workflow exists.
