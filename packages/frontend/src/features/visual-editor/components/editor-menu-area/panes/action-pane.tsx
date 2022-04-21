import { MonacoEditor } from '@/components/monaco-editor'
import { useEditorPropsContext } from '@/features/visual-editor/editor-props-context'
import { useEditorContext } from '@/features/visual-editor/provider'
import { Button, message } from 'antd'
import * as monaco from 'monaco-editor'
import React, { useRef, useEffect, useMemo } from 'react'
import { useEditorPreviewContext } from '../../editor-preview/provider'

const ActionPane: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [{ page }, { updatePageData }, getState] = useEditorContext()
  const { dataSources } = useEditorPreviewContext()
  const { onSave } = useEditorPropsContext()

  useEffect(() => {
    const type = `{ ${Object.keys(dataSources)
      .map((key) => {
        return `${key}: any;`
      })
      .join('\n')} }`
    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
      {
        content: `type ObjectKeysPartial<T> = T extends (...args: any[]) => any ? T : Partial<T>;
        type FunctionReturnPartial<T> = T extends (...args: infer P) => infer R ? (...args: P) => ObjectKeysPartial<R>: T;

        declare const state: ${type};
        declare const setState: (state: ((prevState: ${type}) => ObjectKeysPartial<${type}>) | ObjectKeysPartial<FunctionReturnPartial<${type}>>, replace?: boolean | undefined) => void;`,
      },
    ])
  }, [dataSources])

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
          updatePageData({ js: editorRef.current?.getValue() || '' })
          onSave(getState().page)
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
