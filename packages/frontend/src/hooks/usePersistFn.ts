import { useCallback, useRef } from 'react'

function usePersistFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef(fn)
  fnRef.current = fn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    function (this: Record<PropertyKey, any>, ...args) {
      return fnRef.current.call(this, ...args)
    } as T,
    []
  )
}

export default usePersistFn
