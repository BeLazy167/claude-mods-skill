# hello-mod

The smallest mod that does something. One `tool.call` hook: logs the tool
name to the transcript and refuses Bash commands containing `rm -rf`. Its
`.catch` refuses too if the hook throws, so the guard fails closed.

Copy this folder to start a new mod. Rename in `.claude-plugin/plugin.json`.

Try it for one session (Claude Code 2.1.287 or later):

```sh
claude --plugin-dir examples/hello-mod
```

Run its test, no session needed:

```sh
cd examples/hello-mod && claude plugin test
```

Prove it loads and the deny holds in a real headless run (two small model calls):

```sh
examples/hello-mod/smoke.sh examples/hello-mod hello-mod
```
