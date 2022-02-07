import React, { useEffect, useRef } from 'react'

function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const firstMounted = useRef(false)
  useEffect(() => {
    if (firstMounted.current) {
      return effect()
    }
    firstMounted.current = true
  }, deps)
}

export default useUpdateEffect
