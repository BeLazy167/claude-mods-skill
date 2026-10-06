import { describe, expect, mock, test } from 'claude-code/testing'

// A band site's props, as the engine would hand them
const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

describe('register', () => {
  test('shows the branch and the changed count on each surface', async ($, on) => {
    mock.clock(on)
    on('session.start', ($, e) => ({ cwd: e.cwd }))
    on('process.run', ($, e) => ({
      value: {
        exitCode: 0,
        stdout: e.argv.includes('status') ? ' M a.ts\n?? b.ts\n' : 'main\n',
        stderr: '',
        isStdoutTruncated: false,
        isStderrTruncated: false,
      },
    }))

    await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })

    for (const surface of ['terminal', 'desktop'] as const) {
      const ui = await $.ui.mount({ plugin: 'branch-band', surface, ...BAND })
      expect(await ui.find({ type: 'Text', text: 'main' })).toBeDefined()
      expect(await ui.find({ type: 'Text', text: /2 changed/ })).toBeDefined()
      await ui.unmount()
    }
  })
})
