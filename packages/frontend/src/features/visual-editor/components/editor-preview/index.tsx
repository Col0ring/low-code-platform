import React from 'react'
import { EditorPreviewContextProvider } from './provider'
import { PageRenderNode } from '../../type'
import EditEditorPreview from './edit-editor-preview'
export interface EditorPreviewProps {
  page: PageRenderNode
  editType?: 'prod' | 'edit'
}

const EditorPreview: React.FC<EditorPreviewProps> = ({
  page,
  editType = 'prod',
}) => {
  return (
    <EditorPreviewContextProvider page={page}>
      <EditEditorPreview editType={editType} page={page} />
    </EditorPreviewContextProvider>
  )
}

export default EditorPreview
