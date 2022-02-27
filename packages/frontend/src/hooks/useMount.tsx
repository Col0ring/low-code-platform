import { useEffect } from 'react'

export function useMount(fn: () => void) {
  useEffect(() => {
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useMount
