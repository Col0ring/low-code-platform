import React, { useEffect } from 'react'
import useMountedState from './useMountedState'

export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const isMounted = useMountedState()
  useEffect(() => {
    if (isMounted()) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
