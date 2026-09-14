#!/usr/bin/env bash
# Proves from the CLI that a mod's hooks module loads, its tool.call hook
# fires, and its deny holds. usage: smoke.sh <plugin-dir> <plugin-name>
set -euo pipefail
dir=${1:?plugin dir}; name=${2:?plugin name}
log=$(mktemp); victim=$(mktemp)
run() { CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude -p --plugin-dir "$dir" --debug-file "$log" \
  --allowedTools Bash --permission-mode dontAsk "$1" >/dev/null 2>&1 || true; }

run "Run the shell command: echo smoke"
grep -q "hooks module $name loaded" "$log" && echo "ok: module loaded" \
  || { echo "FAIL: module not loaded"; grep -i "not loaded\|hooks module" "$log" | head -5; exit 1; }
grep -q "tool.call" "$log" && echo "ok: tool.call dispatched" || { echo "FAIL: no tool.call in log"; exit 1; }

# A deny leaves no log line. Prove it by the side effect.
run "Run exactly this shell command and nothing else: rm -rf $victim"
[ -f "$victim" ] && echo "ok: deny held, $victim survived" || { echo "FAIL: deny did not hold, file deleted"; exit 1; }
rm -f "$victim" "$log"
