import { describe, expect, test } from 'claude-code/testing'

describe('register', () => {
  test('denies rm -rf and lets other commands run', async ($, on) => {
    // Answer each call in the engine's place, so no real tool runs
    on('tool.call', () => ({ result: { stdout: 'ok', stderr: '', interrupted: false } }))

    const denied = await $.tool.call({ tool: 'Bash', command: 'rm -rf /tmp/x' })
    expect(denied.deny).toBe('hello-mod: rm -rf is blocked')

    const ran = await $.tool.call({ tool: 'Bash', command: 'echo hi' })
    expect(ran.deny).toBeUndefined()
  })
})
