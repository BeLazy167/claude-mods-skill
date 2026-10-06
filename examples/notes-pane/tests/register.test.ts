import { describe, expect, test } from 'claude-code/testing'

// A pane site's props, as the engine would hand them
const PANE = {
  component: 'Pane',
  requestId: 'notes',
  props: {
    title: 'Notes',
    isFocused: true,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 20 },
    view: {},
  },
} as const

describe('register', () => {
  test('/note saves, the pane lists it, Clear empties it', async ($, on) => {
    // Answer $.store from a Map the test can read
    const store = new Map<string, unknown>()
    on('store.get', ($, e) => ({ value: store.get(e.key) }))
    on('store.set', ($, e) => {
      store.set(e.key, e.value)
      return { value: undefined }
    })
    on('store.delete', ($, e) => {
      store.delete(e.key)
      return { value: undefined }
    })
    on('session.start', ($, e) => ({ cwd: e.cwd }))
    on('command.register', ($, e) => ({ value: { command: e.name } }))
    on('ui.open', () => ({ value: { isPlaced: true } }))
    await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })

    const saved = await $.command.run({
      command: 'note',
      args: 'buy milk',
      origin: { kind: 'composer' },
      presentation: { isFullscreen: false, columns: 80 },
    })
    expect(saved.text).toContain('Saved note 1.')
    expect(store.get('notes')).toEqual(['buy milk'])

    const ui = await $.ui.mount({ plugin: 'notes-pane', surface: 'terminal', ...PANE })
    expect(await ui.find({ type: 'Text', text: /buy milk/ })).toBeDefined()

    await ui.press({ key: 'clear' })
    expect(await ui.find({ type: 'Text', text: /No notes/ })).toBeDefined()
    expect(store.has('notes')).toBe(false)
  })
})
