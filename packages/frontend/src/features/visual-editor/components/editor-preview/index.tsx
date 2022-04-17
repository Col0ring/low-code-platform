import React from 'react'
import { renderNode } from '../node-components'
import { EditorPreviewContextProvider } from './provider'
import { PageRenderNode } from '../../type'
import NodeContainer from '../node-container'

export interface EditorPreviewProps {
  page: PageRenderNode
  editType?: 'prod' | 'edit'
}

const EditorPreview: React.FC<EditorPreviewProps> = ({
  page,
  editType = 'prod',
}) => {
  return (
    <EditorPreviewContextProvider>
      {editType === 'edit' ? (
        <NodeContainer key={page.id} parentNodes={[]} node={page} index={0}>
          {renderNode(page, 'edit')}
        </NodeContainer>
      ) : (
        renderNode(page, 'prod')
      )}
    </EditorPreviewContextProvider>
  )
}

export default EditorPreview
