import axios from 'axios'
import useSetState from '@/hooks/useSetState'
import { noop, paramsToObject, safeJsonParser } from '@/utils'
import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useEditorContext } from '../../provider'
import { PageRenderNode, RemoteDataSource } from '../../type'
import {
  compileExports,
  compileDataSources,
  getBindingValue,
} from '../../utils'

export interface EditorPreviewContextValue {
  dataSources: Record<string, any>
  modal: Record<string, boolean>
  actions: {
    js: Record<string, any>
    internal: {
      openUrl: (
        options: {
          url: string
          openInNewTab: boolean
          openInNewWindow: boolean
        },
        e: React.UIEvent
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

  const [hasCompiled, setHasCompiled] = useSetState({
    dataSources: false,
    js: false,
  })
  const [load, setLoad] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [jsAction, setJsAction] = useState({})
  const pageRemoteDataSources = useMemo(() => {
    return Object.values(page.dataSources || {})
      .filter((item) => item.type === 'remote')
      .map((item) => ({
        ...item,
        fetchData: safeJsonParser(
          (item as RemoteDataSource).fetch.data,
          (item as RemoteDataSource).fetch.data
        ),
      })) as (RemoteDataSource & {
      fetchData: {
        params?: Record<string, any>
        body?: Record<string, any>
        headers?: Record<string, any>
      }
    })[]
  }, [page.dataSources])
  const [remoteFetchFns, setRemoteFetchFns] = useState<
    Record<string, () => void>
  >({})

  const [dataSources, setDataSources] = useSetState<Record<string, any>>(
    () => ({
      urlParams: paramsToObject(params.entries()),
    })
  )

  const dataSourcesRef = useRef<Record<string, any>>({})
  const remoteFetchFnsRef = useRef<Record<string, () => void>>({})
  const memoEditorPreviewContextValue = useMemo<EditorPreviewContextValue>(
    () => ({
      actions: {
        internal: {
          openUrl: ({ openInNewTab, openInNewWindow, url }) => {
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

  const reloadRemoteDataSources = useCallback((...args: string[]) => {
    if (args.length === 0) {
      Object.keys(remoteFetchFnsRef.current).forEach((key) => {
        remoteFetchFnsRef.current[key]()
      })
    } else {
      ;[...new Set(args)].forEach((arg) => {
        remoteFetchFnsRef.current[arg] && remoteFetchFnsRef.current[arg]()
      })
    }
  }, [])

  useEffect(() => {
    compileDataSources(page.dataSources)
      .then((res) => {
        setDataSources((prev) => ({ ...res, urlParams: prev.urlParams }), true)
        Object.assign(dataSourcesRef.current, res)
        Promise.all(
          pageRemoteDataSources.map((remote) =>
            compileExports(remote.hooks, {
              navigate,
              state: dataSourcesRef.current,
              setState: setDataSources,
              reloadRemoteDataSources,
            })
          )
        )
          .then((resArr) => {
            const currentRemoteFetchFns = resArr.reduce((prev, next, i) => {
              const remoteDataSource = pageRemoteDataSources[i]
              const fetchConfig = remoteDataSource.fetch
              prev[remoteDataSource.name] = async () => {
                if (
                  getBindingValue(
                    dataSourcesRef.current,
                    remoteDataSource.doFetch
                  )
                ) {
                  const config = {
                    ...fetchConfig,
                    data: remoteDataSource.fetchData,
                  }
                  await next.beforeFetch(config)
                  axios({
                    url: config.url,
                    method: config.method,
                    headers: config.data.headers,
                    params: config.data.params,
                    data: config.data.body,
                  })
                    .then((resData) => {
                      const value = next.afterFetch(resData, null)
                      setDataSources({
                        [remoteDataSource.name]: value,
                      })
                    })
                    .catch((err) => {
                      const value = next.afterFetch(null, err)
                      setDataSources({
                        [remoteDataSource.name]: value,
                      })
                    })
                }
              }
              return prev
            }, {} as Record<string, () => void>)
            setRemoteFetchFns(currentRemoteFetchFns)
            // autoLoad
            pageRemoteDataSources.forEach((pageRemoteDataSource) => {
              if (pageRemoteDataSource.autoLoad) {
                currentRemoteFetchFns[pageRemoteDataSource.name]()
              }
            })
          })
          .catch(() => {
            // do nothing
          })
      })
      .catch(() => {
        setDataSources({})
      })
      .finally(() => {
        setHasCompiled({
          dataSources: true,
        })
      })
  }, [
    navigate,
    page.dataSources,
    pageRemoteDataSources,
    reloadRemoteDataSources,
    setDataSources,
    setHasCompiled,
  ])
  useEffect(() => {
    Object.assign(dataSourcesRef.current, dataSources)
  }, [dataSources])

  useEffect(() => {
    Object.assign(remoteFetchFnsRef.current, remoteFetchFns)
  }, [remoteFetchFns])

  useEffect(() => {
    compileExports(page.js, {
      state: dataSourcesRef.current,
      setState: setDataSources,
      reloadRemoteDataSources,
      navigate,
    })
      .then((res) => {
        setJsAction(res || {})
      })
      .catch(() => {
        setJsAction({})
      })
      .finally(() => {
        setHasCompiled({
          js: true,
        })
      })
  }, [
    page.js,
    setHasCompiled,
    reloadRemoteDataSources,
    setDataSources,
    navigate,
  ])
  useEffect(() => {
    if (hasCompiled.dataSources && hasCompiled.js) {
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
