export type Branch = { name: string; changed: number }

declare module 'claude-code' {
  interface PluginState {
    'branch-band': { branch: Branch | null }
  }
}
