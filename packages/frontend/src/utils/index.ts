export function noop() {
  // do nothing
}

export type EnsureArray<T> = T extends any[] | readonly any[] ? T : T[]

export function ensureArray<T>(value: T): EnsureArray<T> {
  return (Array.isArray(value) ? value : [value]) as EnsureArray<T>
}
