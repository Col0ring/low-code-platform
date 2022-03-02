import React from 'react'
export * from './local-storage'
export * from './env'
export * from './store'

export function noop() {
  // do nothing
}

export function preventEvent(e: React.UIEvent) {
  e.preventDefault()
}

export function stopPropagation(e: React.UIEvent) {
  e.stopPropagation()
}
export type EnsureArray<T> = T extends any[] | readonly any[] ? T : T[]

export function ensureArray<T>(value: T): EnsureArray<T> {
  return (Array.isArray(value) ? value : [value]) as EnsureArray<T>
}
