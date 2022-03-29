import classnames, { Argument } from 'classnames'
import { useMemo } from 'react'

export function useClassName(args: Argument[], deps: React.DependencyList) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => classnames(...args), deps)
}
export default useClassName
