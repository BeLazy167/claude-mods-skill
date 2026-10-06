import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Note } from '../types'

const PANE = 'notes'
// $.state holds what the pane draws this session. $.store keeps it across sessions.
const notes = atom({ plugin: 'notes-pane', key: 'notes' } as const, [] as Note[])

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    const saved = await $.store.get('notes')
    await update($, notes, () => (Array.isArray(saved) ? saved.map(String) : []))
    await $.command.register({ name: 'note', description: 'Save a note', argumentHint: '<text>' })
    await $.command.register({ name: 'notes', description: 'Show saved notes in a pane' })
    return next(e)
  })

  // A command hook answers alone. Its text is the transcript row the model also reads.
  on('command.run', { command: 'note' }, async ($, e) => {
    const text = e.args.trim()
    if (text === '') return { text: 'Usage: /note <text>' }
    const all = await update($, notes, (list) => [...list, text])
    await $.store.set('notes', all)
    return { text: `Saved note ${all.length}.` }
  })

  on('command.run', { command: 'notes' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Notes' })
    return { text: 'Notes pane opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const list = await read($, notes)
    return (
      <Box flexDirection="column">
        {list.length === 0 && <Text dimColor>No notes. Add one with /note.</Text>}
        {list.map((note, i) => (
          <Text>
            {i + 1}. {note}
          </Text>
        ))}
        <Button
          key="clear"
          label="Clear"
          onPress={async () => {
            await update($, notes, () => [])
            await $.store.delete('notes')
          }}
        />
      </Box>
    )
  })
}
