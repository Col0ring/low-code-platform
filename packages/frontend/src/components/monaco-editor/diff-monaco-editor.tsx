import React, { useEffect, useMemo, useRef } from 'react'
import classnames from 'classnames'
import * as monaco from 'monaco-editor'
import useUpdateEffect from '@/hooks/useUpdateEffect'
import './env'
import './index.less'

export interface DiffMonacoEditorProps
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  originalValue?: string
  defaultValue?: string
  overrideServices?: monaco.editor.IEditorOverrideServices
  className?: string
  style?: React.CSSProperties
  onChange?: (
    value: string,
    event: monaco.editor.IModelContentChangedEvent
  ) => void
  onMounted?: (
    editor: monaco.editor.IStandaloneDiffEditor,
    monacoEditor: typeof monaco
  ) => void
  onUnmounted?: (editor: monaco.editor.IStandaloneDiffEditor) => void
}

export const DiffMonacoEditor: React.FC<DiffMonacoEditorProps> = (props) => {
  const {
    className,
    style,
    onChange,
    onMounted,
    onUnmounted,
    language,
    originalValue = '',
    defaultValue,
    value = defaultValue || '',
    overrideServices,
    ...args
  } = props
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null)
  const safeChangeRef = useRef(false)
  const editorClassName = useMemo(
    () => classnames('monaco-editor-container', className),
    [className]
  )
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      editorRef.current = monaco.editor.createDiffEditor(
        container,
        {
          ...args
        },
        overrideServices
      )
      const editor = editorRef.current
      const originalModel = monaco.editor.createModel(originalValue, language)
      const modifiedModel = monaco.editor.createModel(value, language)
      editor.setModel({
        original: originalModel,
        modified: modifiedModel
      })
      onMounted?.(editor, monaco)
    }
    return () => {
      const editor = editorRef.current
      if (editor) {
        onUnmounted?.(editor)
        const { original, modified } = editor.getModel() || {}
        if (original) {
          original.dispose()
        }
        if (modified) {
          modified.dispose()
        }
        editor.dispose()
      }
    }
  }, [])

  // value onChange
  useEffect(() => {
    const editor = editorRef.current
    if (editor) {
      const { modified } = editor.getModel() || {}
      const disposable = modified?.onDidChangeContent((e) => {
        if (!safeChangeRef.current) {
          onChange?.(modified.getValue(), e)
        }
      })
      return () => {
        disposable?.dispose()
      }
    }
  }, [onChange])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      const { modified, original } = editor.getModel() || {}
      if (original && originalValue !== original.getValue()) {
        original.setValue(originalValue)
      }
      if (modified && value !== modified.getValue()) {
        safeChangeRef.current = true
        const modifiedEditor = editor.getModifiedEditor()
        modifiedEditor.pushUndoStop()
        modified?.pushEditOperations(
          [],
          [
            {
              range: modified.getFullModelRange(),
              text: value
            }
          ],
          () => null
        )
        modifiedEditor.pushUndoStop()
        safeChangeRef.current = false
      }
    }
  }, [value, originalValue])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor && language) {
      const { original, modified } = editor.getModel() || {}
      original && monaco.editor.setModelLanguage(original, language)
      modified && monaco.editor.setModelLanguage(modified, language)
    }
  }, [language])

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

DiffMonacoEditor.defaultProps = {
  language: 'javascript'
}

export default DiffMonacoEditor
