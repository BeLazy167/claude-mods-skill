import { describe, expect, test } from 'claude-code/testing'

describe('register', () => {
  test('registers roll and answers it in range', async ($, on) => {
    const registered: string[] = []
    on('session.start', ($, e) => ({ cwd: e.cwd }))
    on('tool.register', ($, e) => {
      registered.push(e.name)
      return { value: { tool: `mcp__dice-tool__${e.name}` } }
    })
    await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
    expect(registered).toEqual(['roll'])

    const ok = await $.tool.call({ tool: 'mcp__dice-tool__roll', sides: 6 })
    expect(ok.result).toMatch(/^Rolled [1-6] on a d6\.$/)

    const bad = await $.tool.call({ tool: 'mcp__dice-tool__roll', sides: 1 })
    expect(bad.isError).toBe(true)
  })
})
