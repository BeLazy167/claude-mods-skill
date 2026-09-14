# claude-mods-skill

A Claude Code skill that teaches an agent how to build **Claude Mods**:
plugins whose behaviour is a TypeScript function-hook module that runs
inside Claude Code. It ships with `hello-mod`, a working starter you copy.

Mods are early access. They need `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` and
the API moves between releases. The skill points the agent at
`/plugin-types`, the generated declarations, instead of repeating them.

## Install

```sh
claude plugin marketplace add BeLazy167/claude-mods-skill
claude plugin install claude-mods-skill@claude-mods-skill
```

Then ask Claude to build a mod. The `creating-mods` skill loads on its own.

## Turn mods on

```json
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1" } }
```

in `~/.claude/settings.json`, or prefix one run:
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude`.

## What is inside

- `skills/creating-mods/SKILL.md`: the workflow, quick reference, loader rules.
- `skills/creating-mods/references/gotchas.md`: version-tagged traps from real builds.
- `skills/creating-mods/references/examples.md`: public mods worth reading.
- `examples/hello-mod/`: minimal `tool.call` mod plus `smoke.sh` to prove it loads.

## Background

Design thread: https://github.com/anthropics/claude-code/issues/91870.
Anthropic's three built-in mods: https://github.com/anthropics/claude-code/tree/main/mods.
