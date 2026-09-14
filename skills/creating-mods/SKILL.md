---
name: creating-mods
description: Use when asked to build, extend or debug a Claude Mod, a Claude Code plugin with function hooks (a hooks module, register(on), hooks shaped ($, e, next), events like tool.call, prompt.submit, ui.render), or when a hooks module loads but its hook never fires.
---

# Creating Claude Mods

A mod is a Claude Code plugin whose behaviour is a TypeScript module that
runs inside Claude Code. One file exports `register(on)`. Each hook is
`($, e, next)`. Not a shell command hook. Not JSON on stdin.

**Do not guess the API.** It is early access and changes between releases.
The generated declarations are the only reference. The built-in
`plugin-authoring` skill explains the runtime model; read it for `ui.render`,
`turn.step`, background work and tool registration.

## Workflow

1. **Flag on.** Mods load only with `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`.
   Put it in `~/.claude/settings.json` under `env`. Off means silent no-op.
2. **Copy the example.** Copy `examples/hello-mod/` from this plugin's root
   to the new plugin folder. Rename in `plugin.json`. It already has the
   three files a mod needs and a working `tool.call` hook.
3. **Types, when the hook body changes.** `/plugin-types` is an in-session
   slash command with no CLI form. Run it in an interactive session in that
   folder. It writes `.claude/types/claude-code.d.ts` from the running build.
   Read it for the event's `e` shape, the `$` nouns, and the `tsconfig` in
   its header. Skip this step if you only renamed the example. Never
   hand-edit the file. Never commit it.
4. **Write the hook.** One `on(event, matcher?, hook)` per event per module.
   Return without `next` to answer alone. `next(e)` to continue. Rewrite with
   `next({ ...e, ... })`.
5. **Validate.** `claude plugin validate <folder>`. It prints what the module
   hooks and calls on `$`. It checks shape, not whether a noun exists.
6. **Prove it from the CLI.** Run `examples/hello-mod/smoke.sh <folder> <plugin-name>`.
   It runs `claude -p --plugin-dir` with a debug file, greps for
   `hooks module <name> loaded`, then asks for `rm -rf` on a temp file and
   checks the file survived. A deny writes nothing to the debug log. Prove a
   deny by its side effect, never by the log.
7. **Iterate live.** `claude --plugin-dir <folder> --debug`. Saving the
   module reloads it. A skipped hook is one dim transcript line and a full
   reason in the debug log.
8. **Ship.** Add `.claude-plugin/marketplace.json` so the repo is its own
   marketplace. Users run `claude plugin marketplace add <owner>/<repo>` then
   `claude plugin install <name>@<marketplace-name>`. The marketplace name is
   the `name` field in marketplace.json, not the repo name.

## The three files

```
my-mod/
  .claude-plugin/plugin.json   name, version, description
  hooks/hooks.json             { "modules": ["./register.ts"] }
  hooks/register.ts            export function register(on) { on(...) }
```

`hooks.json` with `modules` is what loads the module. A `register.ts` alone
loads the plugin and nothing else. That is the most common silent failure.

## Quick reference

| Need | Write |
|---|---|
| Block a tool call | `return { deny: 'reason' }` before calling `next` |
| Change a call | `return next({ ...e, command: rewritten })` |
| Change the result | `const r = await next(e); return { ...r, text }` |
| Transcript line | `$.ui.log('text')` |
| Persist across sessions | `$.store.get / set` |
| Timer that outlives a dispatch | start it in `session.start`, use `$.clock.every` |
| Every event | `on('*', ...)` |

## Rules the loader enforces

- `$` is written literally as `$.noun.verb(...)`. Never bind, pass, spread or destructure it.
- Imports: relative files and `claude-code` (types only). No node, no npm.
- Event name in `on()` is a string literal. Matcher is a plain object literal.
- One plain hook per event per module. A second `on('tool.call')` throws.
- `deny` after `next` does nothing useful. The tool already ran.

## Common mistakes

See `references/gotchas.md` for the version-tagged list. Top three:
`hooks.json` missing, `$.prompt.submit` with a `/command` (use
`$.command.run`), and background subagents only firing `tool.call`.

## Reference mods

See `references/examples.md` for public mods to read before writing a
render, a PR watcher or a redactor.
