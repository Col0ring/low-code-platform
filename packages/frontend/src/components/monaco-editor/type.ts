import * as monaco from 'monaco-editor'

declare global {
  interface Window {
    MonacoEnvironment: {
      getWorker(file: string, label: string): Worker
    }
  }
}

export type Monaco = typeof monaco

export interface FormatOptions {
  onBefore?: () => void
  onAfter?: (formatted: string) => void
}

export interface EditOptions {
  onBefore?: () => void
  onAfter?: () => void
}

export interface DiffEditResources {
  originalValue: string
  modifiedValue: string
}

export interface DiffEditOptions {
  onOriginalBefore?: () => void
  onOriginalAfter?: () => void
  onModifiedBefore?: () => void
  onModifiedAfter?: () => void
}
