#!/usr/bin/env bash
# Proves a mod's hooks module loads and its tool.call hook fires, from the CLI.
# usage: smoke.sh <plugin-dir> <plugin-name>
set -euo pipefail
dir=${1:?plugin dir}; name=${2:?plugin name}
log=$(mktemp)
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude -p --plugin-dir "$dir" --debug-file "$log" \
  --allowedTools Bash --permission-mode dontAsk \
  "Run the shell command: echo smoke" >/dev/null 2>&1 || true
grep -q "hooks module $name loaded" "$log" && echo "ok: module loaded" || { echo "FAIL: module not loaded"; grep -i "not loaded\|hooks module" "$log" | head -5; exit 1; }
grep -q "tool.call" "$log" && echo "ok: tool.call dispatched" || { echo "FAIL: no tool.call in log"; exit 1; }
