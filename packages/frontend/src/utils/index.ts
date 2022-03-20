import React from 'react'
export * from './local-storage'
export * from './env'
export * from './store'
export * from './dom'

export function noop() {
  // do nothing
}

export function preventDefault(e: React.UIEvent) {
  e.preventDefault()
}

export function stopPropagation(e: React.UIEvent) {
  e.stopPropagation()
}
export type EnsureArray<T> = T extends any[] | readonly any[] ? T : T[]

export function ensureArray<T>(value: T): EnsureArray<T> {
  return (Array.isArray(value) ? value : [value]) as EnsureArray<T>
}

export function safeJsonParser<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str)
  } catch (error) {
    return defaultValue
  }
}
