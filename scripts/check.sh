#!/usr/bin/env bash
# Checks the repo against the installed Claude Code: validate, test and
# type-check every example. Run after each Claude Code update.
# usage: scripts/check.sh   (needs claude and npx; a small model call only
# for an example whose types are not laid yet)
set -euo pipefail
cd "$(dirname "$0")/.."
echo "claude $(claude --version)"
claude plugin validate . >/dev/null 2>&1 && echo "ok: marketplace" || echo "WARN: marketplace validate failed (run: claude plugin validate .)"
for m in examples/*/; do
  m=${m%/}
  claude plugin validate "$m" >/dev/null 2>&1 || { echo "FAIL: validate $m"; claude plugin validate "$m"; exit 1; }
  (cd "$m" && claude plugin test >/dev/null 2>&1) || { echo "FAIL: test $m"; (cd "$m" && claude plugin test); exit 1; }
  # Types are laid on load; a cheap headless load writes them when missing.
  [ -f "$m/.claude-plugin/types/tsconfig.json" ] || claude -p "reply ok" --model haiku --plugin-dir "$m" >/dev/null 2>&1 || true
  npx -y -p typescript@5 tsc -p "$m" --noEmit || { echo "FAIL: tsc $m"; exit 1; }
  echo "ok: $m"
done
