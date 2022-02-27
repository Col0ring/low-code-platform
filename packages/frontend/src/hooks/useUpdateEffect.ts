import React, { useEffect, useRef } from 'react'

export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const firstMounted = useRef(false)
  useEffect(() => {
    if (firstMounted.current) {
      return effect()
    }
    firstMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
