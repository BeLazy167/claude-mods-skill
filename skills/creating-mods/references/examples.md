# Public mods to read

Read the closest one before writing your own. All require the flag.

| Mod | Shows | Repo |
|---|---|---|
| hello-mod | `tool.call` log and deny, the minimum that works | this repo, `examples/hello-mod` |
| secret-redactor | Rewrite tool output before the model reads it, restore on the way into the next call | github.com/ray-amjad/awesome-claude-code-function-hooks |
| cc-pr-tracker | Line above the prompt from `$.process.run` on `gh`, `$.clock.every`, toasts | github.com/sezaakgun/cc-pr-tracker |
| cc-arcade | Interactive `ui.render` on AbovePrompt, `Client` surface modules, `ui.press`, `$.store` | github.com/sezaakgun/cc-arcade |
| gh-ci-status, time | Pinned status line, per-message render | github.com/diegorv/claude-functions-hook |
| diff, sec-default, telemetry | Anthropic's own three, including `engine.create` and `next.to` | github.com/anthropics/claude-code/tree/main/mods |

Design and discussion: github.com/anthropics/claude-code/issues/91870.
The Sep 9 update there carries the `$` cheat sheet image.
