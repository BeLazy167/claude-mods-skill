# Mods to read

Start with this repo's `examples/`: each one passes `claude plugin validate`,
`claude plugin test` and `tsc` (run `scripts/check.sh`). Then read the
closest public mod below before you write a larger one. Public mods track
their own Claude Code version: check their README before you copy an API.

## This repo

| Example | Pattern |
|---|---|
| `examples/hello-mod` | Guard: `tool.call` deny before `next`, fail-closed `.catch`, side-effect smoke test |
| `examples/redact-output` | Rewrite a tool's result after `next`; `.catch` that refuses |
| `examples/branch-band` | Band above the prompt; host command on a timer; `$.state` contract |
| `examples/notes-pane` | Slash command with args; pane with a Button; `$.store` |
| `examples/dice-tool` | A tool the model calls, served by a `tool.call` hook |

## Anthropic

| Mod | Pattern | Source |
|---|---|---|
| diff | Pane beside the transcript, Buttons bound to keybinding actions, its own scrolling, tests | github.com/anthropics/claude-code/tree/main/mods/diff |
| agents-md | `userConfig` option with a picker, `prompt.context`, `session.compact` | github.com/anthropics/claude-code/tree/main/mods/agents-md |
| sec-default | Policy guard that protects managed settings from other plugins | github.com/anthropics/claude-code/tree/main/mods/sec-default |
| telemetry | `engine.create` adds a noun to `$`; ships its types contract | github.com/anthropics/claude-code/tree/main/mods/telemetry |
| token-weather | Context-window chart in the band above the prompt | github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather |
| blast-radius | Holds a risky shell command and asks with proceed and cancel Buttons | github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius |
| replay-theater | `/replay` steps through the last turn's file edits | github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater |

## Community

| Mod | Pattern | Source |
|---|---|---|
| secret-redactor | Placeholders for secrets before the model reads them, restored on the way into the next call | github.com/ray-amjad/awesome-claude-code-function-hooks/tree/main/plugins/secret-redactor |
| cc-pr-tracker | Lines above the prompt from `$.process.run` on `gh`, `$.clock.every`, toasts | github.com/sezaakgun/cc-pr-tracker |
| cc-arcade | Interactive `Client` surface modules, `ui.press`, `$.store` | github.com/sezaakgun/cc-arcade |
| gh-ci-status, time | Pinned status line; a render per message | github.com/diegorv/claude-functions-hook |
| launch-codes | Confirmation code before risky Bash commands, with tests and a types contract | github.com/OneWave-AI/claude-code-mods/tree/main/launch-codes |
| human-in-the-loop | Tools the model calls that wait in a pane until the person answers | github.com/tzafrir/human-in-the-loop |
| flightdeck | Observe-only dashboard pane: every hook passes its event on | github.com/scasella/claude-flightdeck |
| aside | Side chat over a tool-less fork of the transcript (`$.model.fork`) | github.com/JayDoubleu/aside |
| claude-mermaid | Rewrites assistant rows: mermaid fences drawn as box art | github.com/galElmalah/claude-mermaid |
| terminal-browser | A browser in a pane beside the conversation | github.com/zenbu-labs/terminal-browser |

## Find more

- Official docs: code.claude.com/docs/en/plugins/mods/overview, then `create`,
  `events`, `interface`, `api`, `test`, `troubleshoot`, `reference`.
- Catalogue with a validator scan of each mod's reach:
  github.com/karanb192/awesome-claude-code-mods (browse at mods.aidojo.si).
- Design thread and bug reports: github.com/anthropics/claude-code/issues/91870.
