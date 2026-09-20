#!/usr/bin/env bash
# Warn when a git commit lacks a linked work item (Jira key or GitHub #issue).
set -euo pipefail
export HOOK_INPUT
HOOK_INPUT=$(cat)

python3 <<'PY'
import json, os, re, subprocess, sys

raw = os.environ.get("HOOK_INPUT", "")
try:
    data = json.loads(raw) if raw else {}
except json.JSONDecodeError:
    sys.exit(0)

cmd = data.get("command") or ""
if not re.search(r"\bgit\s+commit\b", cmd):
    sys.exit(0)

cwd = data.get("cwd") or "."
try:
    msg = subprocess.check_output(
        ["git", "-C", cwd, "log", "-1", "--format=%B"],
        stderr=subprocess.DEVNULL,
        text=True,
    )
except (subprocess.CalledProcessError, FileNotFoundError):
    sys.exit(0)

jira = re.compile(r"[A-Z][A-Z0-9]+-\d+")
github = re.compile(r"(?i)(?:fixes|closes|refs)?\s*#\d+|(?:\w[\w.-]*/[\w.-]+#\d+)")
if not jira.search(msg) and not github.search(msg):
    print(
        "Daily Work Loop (unlinked work): Latest commit has no Jira key (PROJ-123) or GitHub issue ref (#42 / Fixes #42).",
        file=sys.stderr,
    )
PY
