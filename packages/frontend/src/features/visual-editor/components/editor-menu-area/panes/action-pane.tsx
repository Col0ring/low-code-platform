import { MonacoEditor } from '@/components/monaco-editor'
import { useEditorPropsContext } from '@/features/visual-editor/editor-props-context'
import { useEditorContext } from '@/features/visual-editor/provider'
import { Button, message } from 'antd'
import { editor } from 'monaco-editor'
import React, { useRef } from 'react'

const ActionPane: React.FC = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [{ page }, { updatePageData }, getState] = useEditorContext()
  const { onSave } = useEditorPropsContext()

  return (
    <div className="w-420px h-full">
      <div className="flex justify-end m-2">
        <Button
          type="primary"
          onClick={() => {
            updatePageData({ js: editorRef.current?.getValue() || '' })
            void message.success('应用成功')
          }}
        >
          应用
        </Button>
        <Button
          className="ml-1"
          onClick={() => {
            updatePageData({ js: editorRef.current?.getValue() || '' })
            onSave(getState().page)
          }}
        >
          保存
        </Button>
      </div>
      <MonacoEditor
        formatOnSave
        onSave={() => {
          onSave(page)
        }}
        editor={editorRef}
        defaultValue={
          page.js ||
          `/*
  所有方法都需要通过 export 的方式向外导出才能使用
*/`
        }
        minimap={{
          enabled: false,
        }}
      />
    </div>
  )
}

export default ActionPane
