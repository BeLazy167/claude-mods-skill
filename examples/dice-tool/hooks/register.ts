import type { Register } from 'claude-code'

export const register: Register = (on) => {
  // Register in session.start: it is awaited before the first prompt,
  // so the model sees the tool from turn one.
  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'roll',
      description: 'Roll a die with the given number of sides and return the result.',
      inputSchema: {
        type: 'object',
        properties: { sides: { type: 'integer', minimum: 2, maximum: 1000 } },
        required: ['sides'],
      },
    })
    return next(e)
  })

  // The model calls it as mcp__<plugin name>__<tool name>. This hook serves it.
  on('tool.call', { tool: 'mcp__dice-tool__roll' }, ($, e) => {
    const sides = Number(e.sides)
    if (!Number.isInteger(sides) || sides < 2) {
      return { result: 'sides must be an integer of 2 or more', isError: true }
    }
    const roll = 1 + Math.floor(Math.random() * sides)
    return { result: `Rolled ${roll} on a d${sides}.` }
  })
}
