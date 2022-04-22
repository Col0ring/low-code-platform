/// <reference types="vite/client" />

import { App } from './features/main/type'
import { PageRenderNode } from './features/visual-editor/type'

declare global {
  interface Window {
    appViewId: number
    app: App
    page: PageRenderNode
  }
}
