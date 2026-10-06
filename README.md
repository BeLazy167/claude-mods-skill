# claude-mods-skill

A Claude Code skill that teaches an agent how to build **Claude Mods**:
plugins whose behaviour is a TypeScript function-hook module that runs
inside Claude Code. It ships five small example mods that the agent copies.
Each example passes `claude plugin validate`, `claude plugin test` and `tsc`.

Tested with Claude Code **2.1.290**. Mods need 2.1.287 or later and are on
by default. The old `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` flag is ignored;
remove it from your settings.

Claude Code also has a built-in `plugin-authoring` skill. That one knows
your exact build. This skill sits on top of it: tested examples, traps seen
on real builds, and how to prove and ship a mod.

## Install

At the Claude Code prompt:

```
/plugin install claude-mods-skill --marketplace BeLazy167/claude-mods-skill
```

Or from your shell:

```sh
claude plugin marketplace add BeLazy167/claude-mods-skill
claude plugin install claude-mods-skill@claude-mods-skill
```

Then ask Claude to build a mod. The `creating-mods` skill loads on its own.

## What is inside

- `skills/creating-mods/SKILL.md`: the workflow, which example to copy, quick reference, loader rules, sharing.
- `skills/creating-mods/references/gotchas.md`: version-tagged traps from real builds.
- `skills/creating-mods/references/examples.md`: Anthropic and community mods worth reading.
- `examples/`:

| Example | Shows |
|---|---|
| `hello-mod` | Block a tool call; fail-closed `.catch`; `smoke.sh` proves the deny |
| `redact-output` | Rewrite Bash output before the model reads it |
| `branch-band` | Git branch above the prompt; `$.process.run` on a timer; `$.state` |
| `notes-pane` | `/note` and `/notes`; a pane with a Button; `$.store` |
| `dice-tool` | A tool the model can call |

Try one for a session: `claude --plugin-dir examples/notes-pane`.

## Keeping it current

The mods API changes between releases. After a Claude Code update, run:

```sh
scripts/check.sh
```

It validates, tests and type-checks every example against your build.

## Links

- Docs: https://code.claude.com/docs/en/plugins/mods/overview
- Built-in mods source: https://github.com/anthropics/claude-code/tree/main/mods
- Design thread: https://github.com/anthropics/claude-code/issues/91870
- Community catalogue: https://github.com/karanb192/awesome-claude-code-mods
