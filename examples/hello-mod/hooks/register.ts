import type { Register } from 'claude-code'

/**
 * Minimal mod. Copy this folder and change the hook body.
 *
 * Every hook is ($, e, next). Return without next to answer alone.
 * Return next(e) to let the rest of the chain and the engine run.
 */
export const register: Register = (on) => {
  on('tool.call', ($, e, next) => {
    $.ui.log(`hello-mod: ${e.tool}`)

    // Deny must happen before next(e). After next the tool already ran.
    if (e.tool === 'Bash' && e.command.includes('rm -rf')) {
      return { deny: 'hello-mod: rm -rf is blocked' }
    }

    return next(e)
  })
    // A guard that throws is skipped and the tool runs. This makes it fail closed.
    .catch(($, e, next) => (next.called ? next(e) : { deny: 'hello-mod: guard failed' }))
}
