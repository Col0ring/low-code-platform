import { noop } from '@/utils'
import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router'
import { useEditorContext } from '../../provider'
import { compile } from '../../utils'

export interface EditorPreviewContextValue {
  dataSources: Record<
    string,
    {
      type: 'remote' | 'var'
      value: any
    }
  >
  modal: Record<string, boolean>
  actions: {
    js: Record<string, any>
    internal: {
      openUrl: (
        e: React.UIEvent,
        options: {
          url: string
          openInNewTab: boolean
          openInNewWindow: boolean
        }
      ) => void
    }
  }
}

export const EditorPreviewContext = createContext<EditorPreviewContextValue>({
  dataSources: {},
  modal: {},
  actions: {
    js: {},
    internal: {
      openUrl: noop,
    },
  },
})

export const EditorPreviewContextProvider: React.FC = ({ children }) => {
  const [{ page }] = useEditorContext()
  const navigate = useNavigate()
  const [jsAction, setJsAction] = useState({})
  const memoEditorPreviewContextValue = useMemo<EditorPreviewContextValue>(
    () => ({
      actions: {
        internal: {
          openUrl: (_e, { openInNewTab, openInNewWindow, url }) => {
            if (openInNewTab) {
              window.open(url, '_blank')
            } else {
              if (openInNewWindow) {
                window.open(url, '_self')
              } else {
                navigate(url)
              }
            }
          },
        },
        js: jsAction,
      },
      dataSources: {},
      modal: {},
    }),
    [jsAction, navigate]
  )
  useEffect(() => {
    compile(page.js)
      .then((res) => {
        setJsAction(res || {})
      })
      .catch(() => {
        setJsAction({})
      })
  }, [page.js])
  return (
    <EditorPreviewContext.Provider value={memoEditorPreviewContextValue}>
      {children}
    </EditorPreviewContext.Provider>
  )
}

export function useEditorPreviewContext() {
  return useContext(EditorPreviewContext)
}
