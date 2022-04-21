/// <reference types="vite/client" />

import { App } from './features/main/type'

declare global {
  interface Window {
    appViewId: number
    app: App
  }
}
