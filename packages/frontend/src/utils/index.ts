import { nanoid } from 'nanoid'
import React from 'react'
export * from './local-storage'
export * from './env'
export * from './store'
export * from './dom'
export * from './config'

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
    console.log(error)
    return defaultValue
  }
}

export function getId(prefix: string) {
  return `${prefix}_${nanoid(10)}`
}

export function paramsToObject(entries: IterableIterator<[string, string]>) {
  const result: Record<string, any> = {}
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value
  }
  return result
}
