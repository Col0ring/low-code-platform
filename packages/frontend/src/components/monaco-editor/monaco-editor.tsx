import React, { useMemo, useRef } from 'react'
import classnames from 'classnames'
import * as monaco from 'monaco-editor'
import { useMount, useUpdateEffect, usePersistFn } from '@/hooks'
import { noop } from '@/utils'
import { edit, format } from './utils'
import { Monaco } from './type'
import './index.less'

export interface MonacoEditorProps
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  editor?: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
  formatOnSave?: boolean
  defaultValue?: string
  overrideServices?: monaco.editor.IEditorOverrideServices
  className?: string
  style?: React.CSSProperties
  onChange?: (
    value: string,
    event?: monaco.editor.IModelContentChangedEvent
  ) => void
  onMounted?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => void
  onUnmounted?: (editor: monaco.editor.IStandaloneCodeEditor) => void
}

export const MonacoEditor: React.FC<MonacoEditorProps> = (props) => {
  const {
    editor: editorProp,
    className,
    style,
    onChange = noop,
    onMounted,
    onUnmounted,
    defaultValue,
    formatOnSave = false,
    value = defaultValue || '',
    overrideServices,
    ...args
  } = props
  const onPersistChange = usePersistFn(onChange)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const safeChangeRef = useRef(false)
  const formatOnSaveRef = useRef(formatOnSave)
  formatOnSaveRef.current = formatOnSave
  const editorClassName = useMemo(
    () => classnames('monaco-editor-container', className),
    [className]
  )
  useMount(() => {
    const container = containerRef.current
    if (container) {
      editorRef.current = monaco.editor.create(
        container,
        {
          value,
          ...args,
        },
        overrideServices
      )
      const editor = editorRef.current
      editorProp && (editorProp.current = editor)
      const disposable = editor.onDidChangeModelContent((e) => {
        if (!safeChangeRef.current) {
          onPersistChange(editor.getValue(), e)
        }
      })
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (!formatOnSaveRef.current) {
          return
        }
        format(editor, {
          onBefore() {
            safeChangeRef.current = true
          },
          onAfter(formatted) {
            safeChangeRef.current = false
            onPersistChange(formatted)
          },
        })
      })
      onMounted?.(editor, monaco)
      return () => {
        onUnmounted?.(editor)
        const model = editor.getModel()
        if (model) {
          model.dispose()
        }
        editor.dispose()
        disposable.dispose()
      }
    }
  })

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      edit(editor, value, {
        onBefore() {
          safeChangeRef.current = true
        },
        onAfter() {
          safeChangeRef.current = false
        },
      })
    }
  }, [value])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      editor.updateOptions({
        ...args,
      })
    }
  }, Object.values(args))

  return <div className={editorClassName} style={style} ref={containerRef} />
}

MonacoEditor.defaultProps = {
  language: 'javascript',
}

export default MonacoEditor
