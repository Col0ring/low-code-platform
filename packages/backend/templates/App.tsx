import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import { PageRenderNode } from '../../frontend/src/features/visual-editor/type'
import EditorPreview from '../../frontend/src/features/visual-editor/components/editor-preview'
const pages = process.env.PAGES as unknown as {
  path: string
  content: PageRenderNode
}[]
const routes: RouteObject[] = pages.map((page) => ({
  path: page.path,
  element: <EditorPreview page={page.content} />,
}))
const App: React.FC = () => {
  return <>{useRoutes(routes)}</>
}

export default App
