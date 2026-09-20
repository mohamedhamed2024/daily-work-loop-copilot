#!/usr/bin/env bash
# Install MCP SDK deps once, then run the daily-loop tools server.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
if [ ! -d node_modules/@modelcontextprotocol/sdk ]; then
  npm install --omit=dev 2>/dev/null || npm install --omit=dev
fi
export DAILY_LOOP_PLUGIN_ROOT="${DAILY_LOOP_PLUGIN_ROOT:-$(cd "$DIR/../.." && pwd)}"
exec node "$DIR/index.mjs"
