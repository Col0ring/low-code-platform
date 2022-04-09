import { App } from '../main/type'
import { PageStatus } from './constants'

export interface Page {
  id: number
  name: string
  path: string
  status: PageStatus
  content: string
  app: App
}
