import React, { useEffect, useMemo, useRef } from 'react'
import classnames from 'classnames'
import * as monaco from 'monaco-editor'
import useUpdateEffect from '@/hooks/useUpdateEffect'
import './env'
import './index.less'

export interface MonacoEditorProps
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  defaultValue?: string
  overrideServices?: monaco.editor.IEditorOverrideServices
  className?: string
  style?: React.CSSProperties
  onChange?: (
    value: string,
    event: monaco.editor.IModelContentChangedEvent
  ) => void
  onMounted?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoEditor: typeof monaco
  ) => void
  onUnmounted?: (editor: monaco.editor.IStandaloneCodeEditor) => void
}

export const MonacoEditor: React.FC<MonacoEditorProps> = (props) => {
  const {
    className,
    style,
    onChange,
    onMounted,
    onUnmounted,
    defaultValue,
    value = defaultValue || '',
    overrideServices,
    ...args
  } = props
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const safeChangeRef = useRef(false)
  const editorClassName = useMemo(
    () => classnames('monaco-editor-container', className),
    [className]
  )
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      editorRef.current = monaco.editor.create(
        container,
        {
          value,
          ...args
        },
        overrideServices
      )
      onMounted?.(editorRef.current, monaco)
    }
    return () => {
      const editor = editorRef.current
      if (editor) {
        onUnmounted?.(editor)
        const model = editor.getModel()
        if (model) {
          model.dispose()
        }
        editor.dispose()
      }
    }
  }, [])

  // value onChange
  useEffect(() => {
    const editor = editorRef.current
    if (editor) {
      const disposable = editor.onDidChangeModelContent((e) => {
        if (!safeChangeRef.current) {
          onChange?.(editor.getValue(), e)
        }
      })
      return () => {
        disposable.dispose()
      }
    }
  }, [onChange])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      if (value !== editor.getValue()) {
        safeChangeRef.current = true
        const model = editor.getModel()
        editor.pushUndoStop()
        model?.pushEditOperations(
          [],
          [
            {
              range: model?.getFullModelRange(),
              text: value
            }
          ],
          () => null
        )
        editor.pushUndoStop()
        safeChangeRef.current = false
      }
    }
  }, [value])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      editor.updateOptions({
        ...args
      })
    }
  }, Object.values(args))

  return <div className={editorClassName} style={style} ref={containerRef} />
}

MonacoEditor.defaultProps = {
  language: 'javascript'
}

export default MonacoEditor
