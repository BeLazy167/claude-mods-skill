# Gotchas

Seen on real builds, by this repo's checks or by people in
anthropics/claude-code#91870. The version is where it was last seen.
Re-check on the build you run: the types file wins over this page.

## Loading

| Symptom | Cause | Fix |
|---|---|---|
| Plugin loads, hook never fires | No `hooks/hooks.json` with `modules` | Add it: `{ "modules": ["./register.ts"] }`, path relative to that file. |
| No mod loads at all | Older than 2.1.287, `--safe-mode`, `--bare`, `disableAllHooks`, an untrusted workspace, or managed settings | `claude --version`. Check each. The flag `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` is ignored from 2.1.287. |
| `claude plugin test` says `the rollout switch served off` (2.1.287) | Reported for users on an LLM gateway with no Anthropic account | Known issue in #91870. Nothing to fix in the mod. |
| `name: Plugin name "claude-x" is reserved` (2.1.290) | Names that start with `claude-`, `anthropic-` or `cc-plugin-` pass as Anthropic's | Name the plugin for what it does. |
| `$.ui is used as a value` | `$` or a noun assigned, destructured or computed-indexed | Write `$.noun.verb(...)` at each call site. |
| `$ is passed to "f", which is not a function declared at the top` (2.1.290) | `$` passed to an inner or imported function | Move the helper to the top level of the same file. |
| `on("tool.call") is registered twice` (2.1.290) | Two plain hooks on one event in one module | Merge them, or give each its own matcher. |
| Module refused at load | Import from `fs`, `path`, npm, `require`, or dynamic `import()` | Only relative plugin files and `claude-code`, by `import` declaration. |
| Module file not loaded | A suffix other than `.ts .tsx .js .jsx .mjs .cjs .mts .cts` | Rename it. |

## Semantics

| Symptom | Cause | Fix |
|---|---|---|
| Guard threw, tool ran anyway | A failed hook is skipped: guards fail open | `.catch(($, e, next) => next.called ? next(e) : { deny: 'why' })`. Validate lists `gating hook without .catch`. |
| Tool ran, model told it was refused | `deny` returned after `next(e)` | Deny before `next`. |
| Hook returns `{}` or `undefined` | Wrong shape, hook skipped, tool runs | Return `next(e)` or a full result. |
| Rewritten result ignored | Returned `{ ...r, text }` from `next` | `text` and `ref` are set by core. Answer `{ result: newResult }`. |
| Hook skipped after about 10 s | Hook budget. Waits on `next` or `$` do not count; `$.clock.sleep` does | Long work goes in `session.start` plus `$.clock`. Read `next.budget.remainingMs`. `.catch` still runs on overrun, with a 1 s grace. |
| Timer, counter or cache reset on save | A hot reload runs `register` again; module variables start over | Keep values in `$.state` (session) or `$.store` (across sessions). |
| `$.state.set` denied | Written while drawing | Write from a handler, `update($, atom, fn)`, or another event. |
| `agent.spawn` does not fire for a named teammate (2.1.287) | Reported in #91870 | Track its loop by the `agentId` on its `tool.call` and `turn.complete`. |
| `turn.start` has no `agentId` (2.1.289) | Not carried there yet | Use `turn.step` or `turn.complete`. |
| A deny guard on paths is bypassed | `..`, symlinks, other spellings | Allow-list on `(await $.fs.stat(path, { resolve: true })).realPath`. |
| Subagent in a worktree ran in the main tree (before 2.1.288) | A `tool.call` hook broke worktree isolation | Fixed in 2.1.288. Update. |

## Rendering

| Symptom | Cause | Fix |
|---|---|---|
| Tree not drawn, engine's own drawn | Tree did not validate | Transcript line `<plugin>: ui.render (<Component>) refused: <reason>` while hot-reloading; else the debug log. |
| `Box is not defined` | Elements are not globals | `const { Box, Text } = $.ui.resolve(e)` in the hook. `h` is global. |
| Element missing on one surface | Tables differ: `mobile` has no `Input`, `vscode` no `Client`, only `terminal` has `Raster` and `Image` | Narrow on `e.surface`. Test on `terminal` and `desktop`. |
| Band or pane overflows | Sized to `e.viewport.columns` | Size to `e.props.bodyColumns`. |
| `Text key="..."` not found in a test (2.1.290) | `Text` takes no `key`; it is dropped | Find by text: `ui.find({ type: 'Text', text: /.../ })`. Keys go on `Box`, `Button`, `Input`. |
| Client module not found | Path was an expression | `Client({ module: './board.js' })` with a string literal. |
| Pane never opens unasked | Opened from `session.start` or a timer below 144 columns | Open it from a command or a Button, or accept the wait. |

## Testing

| Symptom | Cause | Fix |
|---|---|---|
| `no implementation for session.start` | Nothing sits beneath the plugin in a test | Answer it: `on('session.start', ($, e) => ({ cwd: e.cwd }))`. Same for `command.register`, `ui.open`, `process.run`. |
| `$.store` undefined on the test's `$` (2.1.290) | The test `$` has no `store` noun | `mock.store(on, {})`, or answer `store.get` and `store.set` with your own `Map` (see `notes-pane`). |
| `tsc` rejects a mount target | `props` must be the site's full props | Copy the `BAND` or `PANE` constant from the examples. |

## Distribution

| Symptom | Cause | Fix |
|---|---|---|
| `Plugin "x" not found in marketplace "repo-name"` | The marketplace name is the `name` in marketplace.json | Use that name after `@`. |
| Users do not get the update | Installed plugins are cached by `version` | Bump `version` each release. Develop with `--plugin-dir`, not the installed copy. |
| Types stale after an update | Types are rewritten on each load | Load the mod once. Never commit `.claude-plugin/types/`. Commit the root `tsconfig.json`. |
