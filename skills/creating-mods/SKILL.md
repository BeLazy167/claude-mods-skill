---
name: creating-mods
description: Use when asked to build, extend or debug a Claude Mod, a Claude Code plugin with function hooks (a hooks module, register(on), hooks shaped ($, e, next), events like tool.call, prompt.submit, ui.render), or when a hooks module loads but its hook never fires.
---

# Creating Claude Mods

A mod is a Claude Code plugin whose behaviour is a TypeScript or JavaScript
module that runs inside Claude Code. One file exports `register(on)`. Each
hook is `($, e, next)`. Not a shell command hook. Not JSON on stdin.

Mods are on by default from Claude Code 2.1.287. No flag. The old
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` is ignored; remove it.

**Do not guess the API.** It is early access and changes between releases.
The built-in `plugin-authoring` skill is the source of truth for the running
build: it names this build's types file, the session's mods folder and the
hot-reload flow. Load it first. This skill adds tested example mods to copy,
traps seen on real builds, and how to prove and ship a mod.

## Workflow

1. **Load `plugin-authoring`.** Follow its WHERE TO WRITE IT for a mod made in
   this session. For a mod the person keeps in a repo, use a folder they own.
2. **Copy the closest example.** Pick from the table below. Each one passes
   validate, test and `tsc` on the build in `scripts/check.sh`. Rename it in
   `plugin.json`. The name must not start with `claude-` or `cc-plugin-`;
   validate rejects names that look like Anthropic's own.
3. **Read the types for the event.** Claude Code writes them on every load
   into `<mod>/.claude-plugin/types/`, plus a root `tsconfig.json` that
   extends them. There is no command to run. Before the first load, use the
   types file `plugin-authoring` names. Grep for the event (`'tool.call'`)
   and read the declaration. Never edit or commit `.claude-plugin/types/`.
4. **Write the hook.** One `on(event, matcher?, hook)` per event per module,
   or one per distinct matcher. Return without `next` to answer alone.
   `next(e)` to continue. Rewrite with `next({ ...e, ... })`. Give every hook
   that can refuse something a `.catch` (see the quick reference).
5. **Validate.** `claude plugin validate <mod>`. It lists what the module
   hooks and calls, its `$.state` reads and writes, and each gating hook with
   or without `.catch`. It checks the module the way the engine loads it.
6. **Test.** Write `tests/*.test.ts` and run `claude plugin test` in the mod
   folder. No session, no network. Copy the test from the closest example.
7. **Type-check.** `npx -p typescript@5 tsc -p <mod> --noEmit` once the types
   are laid.
8. **Prove it live.** `claude --plugin-dir <mod>`. Saving a file hot-reloads
   it. A failed hook or module prints one dim transcript line with the reason.
   `claude --debug` has the full log. For a guard, prove the deny by its side
   effect: `examples/hello-mod/smoke.sh` shows how.
9. **Ship.** See Sharing below.

## Examples to copy

All live in `examples/` at this plugin's root. Read the whole folder: the
hooks module, its `tests/`, and `types/` where present.

| Task | Example | Shows |
|---|---|---|
| Block a tool call | `hello-mod` | `tool.call` deny before `next`, fail-closed `.catch`, `smoke.sh` |
| Change a tool's output before the model reads it | `redact-output` | `await next(e)`, answer with a new `{ result }`, `.catch` that refuses, `$.ui.status` |
| A line or band above the prompt | `branch-band` | `ui.render` on `AbovePrompt`, `$.process.run`, `$.clock.every` from `session.start`, `$.state` with a types contract, mount test |
| A slash command and a pane | `notes-pane` | `$.command.register`, `command.run` with args, `$.ui.open`, Pane render, Button `onPress`, `$.store` across sessions |
| A tool the model can call | `dice-tool` | `$.tool.register` in `session.start`, `tool.call` on `mcp__<plugin>__<tool>`, `isError` result |

For larger patterns (Client modules, model calls, policy guards, noun
contracts), read the public mods in `references/examples.md`.

## Quick reference

| Need | Write |
|---|---|
| Block a tool call | `return { deny: 'reason' }` before calling `next` |
| Fail closed when a guard throws | `on(...).catch(($, e, next) => next.called ? next(e) : { deny: 'why' })` |
| Change a call | `return next({ ...e, command: rewritten })` |
| Change the result | `const r = await next(e); return { result: { ...r.result, stdout } }` |
| Answer a call without running the tool | `return { result: 'text' }` |
| Transcript line, status, toast | `$.ui.log(text)`, `$.ui.status(text)`, `$.ui.toast(text)` |
| Values a drawing reads | `atom(ref, initial)`, `read($, atom)`, `update($, atom, fn)` from `'claude-code'`, declared in `types/index.d.ts` |
| Persist across sessions | `$.store.get / set / delete` |
| Timer that outlives a dispatch | start it in `session.start`, use `$.clock.every` |
| Run a host command | `$.process.run(['git', 'status'])` (argv, no shell) |
| Run a slash command | `$.command.run({ command: 'compact' })`, not `$.prompt.submit` |
| Every event | `on('*', ...)`; a namespace: `on('tool.*', ...)` |

## Rules the loader enforces

- Write `$` calls in full: `$.noun.verb(...)`. Never assign, destructure or
  computed-index `$` or a noun. You may pass `$` to a function declared at
  the top level of the same file, and to `read`/`update`. Not to an inner or
  imported function.
- Imports: relative files of the plugin and `claude-code`. No Node, no npm,
  no `require`, no dynamic `import()`. Every file is an ES module.
- The event name in `on()` is a string literal. The matcher is a plain object literal.
- Do not redeclare `on` inside `register`.
- Two plain hooks on one event in one module fail. Merge them or give each a matcher.
- A `deny` after `next` undoes nothing. The tool already ran.

## Sharing

1. Copy the mod out of the session's mods folder (it is deleted after
   `cleanupPeriodDays`) into a repo you keep.
2. Add `.claude-plugin/marketplace.json` beside `plugin.json`, with one
   entry whose `source` is `"./"`. `claude plugin validate .` checks both.
3. The install line for a README:
   `/plugin install <mod> --marketplace <owner>/<repo>` at the Claude Code
   prompt, or `claude plugin marketplace add <owner>/<repo>` then
   `claude plugin install <mod>@<marketplace-name>`. The marketplace name is
   the `name` in marketplace.json, not the repo name.
4. Bump `version` in `plugin.json` on every release. Installed copies are
   cached by version, so users get nothing new without it.
5. Say in the README which Claude Code version you tested with.

## Common mistakes

See `references/gotchas.md` for the version-tagged list. Top three:
`hooks/hooks.json` missing, a guard without `.catch` that fails open, and a
`claude-` plugin name that validate rejects.
