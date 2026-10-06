import type { Register } from 'claude-code'

// ponytail: three token shapes only; widen the list for your own secrets.
const TOKEN = /\b(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g

const redact = (text: string) => text.replace(TOKEN, '[redacted]')

export const register: Register = (on) => {
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    // A deny or an error has no stdout to clean.
    if (ran.deny !== undefined || ran.isError) return ran

    const stdout = redact(ran.result.stdout)
    if (stdout === ran.result.stdout) return ran

    $.ui.status('redact-output: hid a token from the model')
    // Answer with a new { result }. Leaving out ref and text makes core map it again.
    return { result: { ...ran.result, stdout } }
  })
    // If the hook throws, the raw output would reach the model. Refuse instead.
    // The command already ran; the deny only keeps its output from the model.
    .catch(() => ({ deny: 'redact-output: could not check the output' }))
}
