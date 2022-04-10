import { noop } from '@/utils'
import { useContext, createContext } from 'react'

export interface EditorPreviewContextValue {
  modal: Record<string, boolean>
  actions: {
    js: Record<string, any>
    internal: {
      openUrl: (options: {
        url: string
        openInNewTab: boolean
        openInNewWindow: boolean
      }) => void
    }
  }
}

export const EditorPreviewContext = createContext<EditorPreviewContextValue>({
  modal: {},
  actions: {
    js: {},
    internal: {
      openUrl: noop,
    },
  },
})

export function useEditorPreviewContext() {
  return useContext(EditorPreviewContext)
}
