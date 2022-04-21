import EditorPreview from '@/features/visual-editor/components/editor-preview'
import { PageRenderNode } from '@/features/visual-editor/type'
import { safeJsonParser } from '@/utils'
import React from 'react'
import { useRoutes } from 'react-router-dom'

const AppShowView: React.FC = () => {
  const app = window.app
  const routesELement = useRoutes(
    app?.pages.map((page) => {
      const pageRenderNode = safeJsonParser<PageRenderNode | null>(
        page.content,
        null
      )
      return {
        path: page.path,
        element: pageRenderNode ? (
          <EditorPreview page={pageRenderNode} />
        ) : null,
      }
    }) || []
  )

  return <>{routesELement}</>
}

export default AppShowView
