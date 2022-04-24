import ModalButton from '@/components/modal-button'
import { MonacoEditor } from '@/components/monaco-editor'
import { editor } from 'monaco-editor'
import React from 'react'
export interface EditCycleDataProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}
const EditCycleData: React.FC<EditCycleDataProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)
  return (
    <ModalButton
      disabled={disabled}
      block
      type="primary"
      onModalOK={() => {
        onChange && onChange(editorRef.current?.getValue() || '[]')
      }}
      modal={
        <MonacoEditor
          className="h-400px"
          value={value}
          editor={editorRef}
          defaultValue="[]"
          scrollBeyondLastLine={false}
          language="text"
          minimap={{
            enabled: false,
          }}
        />
      }
    >
      编辑数据
    </ModalButton>
  )
}

export default EditCycleData
