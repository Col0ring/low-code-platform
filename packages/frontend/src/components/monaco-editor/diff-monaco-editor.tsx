import React, { useEffect, useMemo, useRef } from 'react'
import classnames from 'classnames'
import * as monaco from 'monaco-editor'
import useUpdateEffect from '@/hooks/useUpdateEffect'
import usePersistFn from '@/hooks/usePersistFn'
import { noop } from '@/utils'
import { editDiff, formatDiff } from './utils'
import './env'
import './index.less'

export interface DiffMonacoEditorProps
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  formatOnSave?: boolean
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
    onChange = noop,
    onMounted,
    onUnmounted,
    language = 'javascript',
    formatOnSave = false,
    originalValue = '',
    defaultValue,
    value = defaultValue || '',
    overrideServices,
    ...args
  } = props
  const onPersistChange = usePersistFn(onChange)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null)
  const safeChangeRef = useRef(false)
  const formatOnSaveRef = useRef(formatOnSave)
  formatOnSaveRef.current = formatOnSave

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
      const disposable = modifiedModel.onDidChangeContent((e) => {
        if (!safeChangeRef.current) {
          onPersistChange?.(modifiedModel.getValue(), e)
        }
      })
      editor.setModel({
        original: originalModel,
        modified: modifiedModel
      })
      const modifiedEditor = editor.getModifiedEditor()
      modifiedEditor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          if (!formatOnSaveRef.current) {
            return
          }
          formatDiff(editor, {
            onBefore() {
              safeChangeRef.current = true
            },
            onAfter() {
              safeChangeRef.current = false
            }
          })
        }
      )
      onMounted?.(editor, monaco)
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
          disposable.dispose()
        }
      }
    }
  }, [])

  useUpdateEffect(() => {
    const editor = editorRef.current
    if (editor) {
      editDiff(
        editor,
        { modifiedValue: value, originalValue },
        {
          onModifiedBefore() {
            safeChangeRef.current = true
          },
          onModifiedAfter() {
            safeChangeRef.current = false
          }
        }
      )
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
