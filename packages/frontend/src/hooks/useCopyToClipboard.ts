import writeText from 'copy-to-clipboard'
import { useCallback, useState } from 'react'
import useMountedState from './useMountedState'

interface UseCopyToClipboardState {
  value?: string
  noUserInteraction: boolean
  error: Error | null
}

type UseCopyToClipboardReturn = [
  UseCopyToClipboardState,
  (value: string) => void
]

function useCopyToClipboard(): UseCopyToClipboardReturn {
  const isMounted = useMountedState()
  const [state, setState] = useState<UseCopyToClipboardState>({
    value: undefined,
    error: null,
    noUserInteraction: true,
  })

  const copyToClipboard = useCallback(
    (value) => {
      if (!isMounted()) {
        return
      }
      let normalizedValue: string | undefined
      try {
        // only strings and numbers casted to strings can be copied to clipboard
        if (typeof value !== 'string' && typeof value !== 'number') {
          const error = new Error(
            `Cannot copy typeof ${typeof value} to clipboard, must be a string`
          )

          setState({
            value,
            error,
            noUserInteraction: true,
          })
          return
        } else if (value === '') {
          // empty strings are also considered invalid
          const error = new Error(`Cannot copy empty string to clipboard.`)

          setState({
            value,
            error,
            noUserInteraction: true,
          })
          return
        }
        normalizedValue = value.toString()
        const noUserInteraction = writeText(normalizedValue)
        setState({
          value: normalizedValue,
          error: null,
          noUserInteraction,
        })
      } catch (error) {
        setState({
          value: normalizedValue,
          error: error as Error,
          noUserInteraction: true,
        })
      }
    },
    [isMounted]
  )

  return [state, copyToClipboard]
}

export type { UseCopyToClipboardState, UseCopyToClipboardReturn }
export default useCopyToClipboard
