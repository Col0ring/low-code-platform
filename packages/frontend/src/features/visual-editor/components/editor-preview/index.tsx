import React, { useMemo } from 'react'
import { renderNode } from '../node-components'
import { useNavigate } from 'react-router'
import { EditorPreviewContext, EditorPreviewContextValue } from './provider'
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
  const navigate = useNavigate()
  const memoEditorPreviewContextValue = useMemo<EditorPreviewContextValue>(
    () => ({
      actions: {
        internal: {
          openUrl: ({ openInNewTab, openInNewWindow, url }) => {
            if (openInNewTab) {
              window.open(url, '_blank')
            } else {
              if (openInNewWindow) {
                window.open(url, '_self')
              } else {
                navigate(url)
              }
            }
          },
        },
        js: {},
      },
      modal: {},
    }),
    [navigate]
  )
  return (
    <EditorPreviewContext.Provider value={memoEditorPreviewContextValue}>
      {editType === 'edit' ? (
        <NodeContainer key={page.id} parentNodes={[]} node={page} index={0}>
          {renderNode(page, 'edit')}
        </NodeContainer>
      ) : (
        renderNode(page, 'prod')
      )}
    </EditorPreviewContext.Provider>
  )
}

export default EditorPreview
