# hello-mod

The smallest mod that does something. One `tool.call` hook: logs the tool
name to the transcript and refuses Bash commands containing `rm -rf`.

Copy this folder to start a new mod. Rename in `.claude-plugin/plugin.json`.

Try it for one session:

```sh
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir examples/hello-mod
```

Prove it loads without an interactive session:

```sh
examples/hello-mod/smoke.sh examples/hello-mod hello-mod
```
