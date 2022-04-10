import EditorPreview from '@/features/visual-editor/components/editor-preview'
import { PageRenderNode } from '@/features/visual-editor/type'
import { Path } from '@/router/constants'
import RouteLoading from '@/router/route-loading'
import { HttpStatus } from '@/store'
import { safeJsonParser } from '@/utils'
import React from 'react'
import { Navigate, useParams, useRoutes } from 'react-router-dom'
import { useGetAppViewQuery } from '../../app.service'

const AppView: React.FC = () => {
  const { appId } = useParams() as { appId: string }
  const { data, error, isLoading } = useGetAppViewQuery(+appId)
  const routesELement = useRoutes(
    data?.pages.map((page) => {
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

  return isLoading ? (
    <RouteLoading loadingFullScreen />
  ) : error ? (
    (error as any).status === HttpStatus.Forbidden ? (
      <Navigate to={Path.Forbidden} replace />
    ) : null
  ) : (
    <>{routesELement}</>
  )
}

export default AppView
