import { describe, expect, test } from 'claude-code/testing'

describe('register', () => {
  test('hides tokens in Bash output and leaves clean output alone', async ($, on) => {
    let stdout = ''
    on('tool.call', () => ({ result: { stdout, stderr: '', interrupted: false } }))
    on('ui.status', () => ({ value: undefined }))

    stdout = 'key=sk-abcdefghijklmnopqrstu done'
    const dirty = await $.tool.call({ tool: 'Bash', command: 'cat .env' })
    expect(dirty.result).toMatchObject({ stdout: 'key=[redacted] done' })

    stdout = 'hello'
    const clean = await $.tool.call({ tool: 'Bash', command: 'echo hello' })
    expect(clean.result).toMatchObject({ stdout: 'hello' })
  })
})
