export type Note = string

declare module 'claude-code' {
  interface PluginState {
    'notes-pane': { notes: Note[] }
  }
}
