import { Page } from '../app/type'
import { AppStatus } from './constants'

export interface App {
  id: number
  name: string
  icon: string
  desc: string
  status: AppStatus
  pages: Page[]
}

export interface Template {
  id: number
  name: string
  icon: string
  desc: string
  app: App
}
