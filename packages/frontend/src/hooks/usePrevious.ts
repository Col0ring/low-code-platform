import { useRef, useMemo, useEffect } from 'react'

type compareFunction<T> = (prev: T | undefined, next: T) => boolean

function usePrevious<T>(state: T, compare?: compareFunction<T>): T | undefined {
  const prevRef = useRef<T>()

  const needUpdate = useMemo(
    () =>
      typeof compare === 'function' ? compare(prevRef.current, state) : true,
    [compare, state]
  )

  useEffect(() => {
    if (needUpdate) {
      prevRef.current = state
    }
  }, [needUpdate, state])

  return prevRef.current
}

export type { compareFunction }
export default usePrevious
