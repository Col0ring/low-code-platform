import { useCallback, useState } from 'react'
import isFunction from 'lodash/isFunction'

type ObjectKeysPartial<T> = T extends (...args: any[]) => any ? T : Partial<T>

type FunctionReturnPartial<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => ObjectKeysPartial<R>
  : T

type SetMergeStateTool<T> = T extends (state: infer P) => infer R
  ? (state: ObjectKeysPartial<FunctionReturnPartial<P>>, replace?: boolean) => R
  : T

function useSetState<S extends Record<string, any>>(initial: S | (() => S)) {
  const [state, setState] = useState(initial)
  const setMergeState: SetMergeStateTool<typeof setState> = useCallback(
    (currentState, replace) => {
      if (isFunction(currentState)) {
        setState((prevState) => ({
          ...(!replace ? prevState : ({} as S)),
          ...currentState(prevState),
        }))
      } else {
        setState((prevState) => ({
          ...(!replace ? prevState : ({} as S)),
          ...currentState,
        }))
      }
    },
    []
  )

  return [state, setMergeState] as const
}

export default useSetState
