import type { ResultData, ResultError } from '@/store'
export * from '@/store/createServiceApi'

export function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

export function isResolved<D extends ResultData, E extends ResultError>(
  result: D | E
): result is D {
  return !(result as E).error
}
