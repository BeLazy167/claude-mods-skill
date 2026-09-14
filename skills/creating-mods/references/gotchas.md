# Gotchas

Observed on real builds by people in anthropics/claude-code#91870.
Version numbers are where it was seen. Re-check on the build you run.

## Loading

| Symptom | Cause | Fix |
|---|---|---|
| Plugin loads, hook never fires | No `hooks/hooks.json` with `modules` | Add it. `hooksModule` in plugin.json registers nothing. |
| Nothing at all, no error | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` unset | Set it in settings `env`. The debug log says `rollout flag ... is off`. |
| Module refused at load | `$` bound, passed or destructured | Spell `$.noun.verb(...)` at every call site. |
| Module refused at load | Import from `fs`, `path`, npm | Only relative files and `claude-code`. |
| Second `on('tool.call')` throws | One plain hook per event per module | Merge into one hook or use a matcher. |
| Unknown top-level key in `hooks.json` (2.1.250) | Whole file dropped | Only `description` and `modules`. |

## Semantics

| Symptom | Cause | Fix |
|---|---|---|
| Tool ran, model told it was refused | `deny` returned after `next(e)` | Deny before `next`. |
| `{ deny: '' }` wrote the file (2.1.260) | Empty deny treated as allow | Fixed 2.1.261. Give a reason. |
| Hook returns `{}` or `undefined` | Treated as skipped, tool runs | Return `next(e)` or a full result. |
| Deny worked but debug log shows nothing | Denies are not logged (2.1.270) | Check the side effect: the file, the command output, the model's reply. |
| `[WARN] plugin x: options requested but its manifest declares no userConfig` | Register signature has `options` but plugin.json has no `userConfig` | Harmless. Drop the parameter or add `userConfig`. |
| `$.prompt.submit('/foo')` refused | Slash text refused | `$.command.run({ command: 'foo' })`. |
| Hook skipped after 10 s | Dispatch budget | Do the work in `session.start` plus `$.clock`. |
| Throw inside hook | Hook skipped, chain continues beneath | Catch it yourself, or add `.catch` on the registration. |
| Timeout cannot be caught | Budget is enforced outside your code | `Promise.race` with `$.clock.sleep`. |
| Hook sees no subagent spawn | Background agents fire only `tool.call` (2.1.263) | Do not rely on `agent.spawn` for them. |
| `$.fs` denies a path in the project | Fence is a string compare | Use the same spelling as `$.session.cwd()`. |
| Parallel guards run one after another | Middleware serialises | Call `next(e)` without awaiting when you do not need the result. |

## Rendering

| Symptom | Cause | Fix |
|---|---|---|
| Tree not drawn, engine's own drawn | Tree did not validate | Debug log line starts `ui.render (<Component>): a hook returned a tree that does not validate`. |
| `h` is not defined | Surface module needs `h` as a local | Destructure from `$.ui.resolve(e)`. |
| Client module not found | Path was an expression | `Client({ module: './board.js' })` with a string literal. |
| Band is small | AbovePrompt is about half the terminal, redraws ~10/s | Size to `e.viewport.columns`. |
| Cold draw slow | 1.4 s first draw seen on 2.1.26x | Known. Redraws are 150 to 190 ms. |

## Distribution

| Symptom | Cause | Fix |
|---|---|---|
| `Plugin "x" not found in marketplace "repo-name"` | Marketplace name is the `name` in marketplace.json | Use that name after `@`. |
| Types stale after update | Declarations are regenerated per build | Re-run `/plugin-types`. Do not commit the file. |
