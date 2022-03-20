import { useCallback, useEffect, useRef } from 'react'

function useMountedState() {
  const mountedRef = useRef(false)
  const getState = useCallback(() => mountedRef.current, [])
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return getState
}

export default useMountedState
