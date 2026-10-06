import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Branch } from '../types'

// Drawn values live in $.state, so they survive a hot reload and redraw readers.
const branch = atom({ plugin: 'branch-band', key: 'branch' } as const, null)

/** Reads the branch and the count of changed files. Null outside a git repo. */
async function readBranch($: EngineInterface): Promise<Branch | null> {
  const head = await $.process.run(['git', 'branch', '--show-current'])
  if (head.exitCode !== 0) return null
  const status = await $.process.run(['git', 'status', '--porcelain'])
  const changed = status.stdout.split('\n').filter(Boolean).length
  return { name: head.stdout.trim() || '(detached)', changed }
}

export const register: Register = (on) => {
  // Work that outlives one dispatch starts in session.start and runs on $.clock.
  on('session.start', async ($, e, next) => {
    const refresh = async () => {
      const now = await readBranch($)
      await update($, branch, () => now)
    }
    await refresh()
    $.clock.every(15_000, () => void refresh())
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const now = await read($, branch)
    // Nothing to show: let the engine draw its own band.
    if (now === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text dimColor>git: </Text>
        <Text>{now.name}</Text>
        {now.changed > 0 && <Text color="yellow"> · {now.changed} changed</Text>}
      </Box>
    )
  })
}
