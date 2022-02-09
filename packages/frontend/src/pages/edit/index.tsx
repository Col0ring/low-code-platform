import React from 'react'
import { MonacoEditor } from '@/components/monaco-editor'

const EditPage: React.FC = () => {
  return (
    <div>
      <MonacoEditor theme="vs-dark" style={{ height: '100vh' }} />
    </div>
  )
}

export default EditPage
