import useSetState from '@/hooks/useSetState'
import { noop } from '@/utils'
import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import { useNavigate } from 'react-router'
import { useEditorContext } from '../../provider'
import { PageRenderNode } from '../../type'
import { compileActions, compileDataSources } from '../../utils'

export interface EditorPreviewContextValue {
  dataSources: Record<string, any>
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
export interface EditorPreviewContextProviderProps {
  page?: PageRenderNode
}
export const EditorPreviewContextProvider: React.FC<
  EditorPreviewContextProviderProps
> = ({ children, page: pageProp }) => {
  const [{ page: contextPage }] = useEditorContext(false) || [{}, {}]
  const page = pageProp || (contextPage as PageRenderNode)
  const [hasCompiled, setHasCompiled] = useState(false)
  const [load, setLoad] = useState(false)
  const navigate = useNavigate()
  const [jsAction, setJsAction] = useState({})
  const [dataSources, setDataSources] = useSetState<Record<string, any>>({})
  const dataSourcesRef = useRef<Record<string, any>>({})
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
      dataSources,
      modal: {},
    }),
    [jsAction, navigate, dataSources]
  )
  useEffect(() => {
    compileDataSources(page.dataSources)
      .then((res) => {
        setDataSources(res, true)
      })
      .catch(() => {
        setDataSources({})
      })
  }, [page.dataSources, setDataSources])
  useEffect(() => {
    Object.assign(dataSourcesRef.current, dataSources)
  }, [dataSources])
  useEffect(() => {
    compileActions(page.js, dataSourcesRef.current, setDataSources)
      .then((res) => {
        setHasCompiled(true)
        setJsAction(res || {})
      })
      .catch(() => {
        setJsAction({})
      })
  }, [page.js, setDataSources])
  useEffect(() => {
    if (hasCompiled) {
      setLoad(true)
    }
  }, [hasCompiled])
  return (
    <EditorPreviewContext.Provider value={memoEditorPreviewContextValue}>
      {load && children}
    </EditorPreviewContext.Provider>
  )
}

export function useEditorPreviewContext() {
  return useContext(EditorPreviewContext)
}
