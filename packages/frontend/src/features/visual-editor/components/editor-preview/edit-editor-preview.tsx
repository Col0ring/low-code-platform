import React from 'react'
import { renderNode } from '../node-components'
import { PageRenderNode } from '../../type'
import NodeContainer from '../node-container'

export interface EditEditorPreviewProps {
  page: PageRenderNode
  editType?: 'prod' | 'edit'
}

const EditEditorPreview: React.FC<EditEditorPreviewProps> = ({
  page,
  editType = 'prod',
}) => {
  return editType === 'edit' ? (
    <NodeContainer key={page.id} parentNodes={[]} node={page} index={0}>
      {renderNode(page, 'edit')}
    </NodeContainer>
  ) : (
    renderNode(page, 'prod')
  )
}

export default EditEditorPreview
