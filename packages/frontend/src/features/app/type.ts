import { PageStatus } from './constants'

export interface Page {
  id: number
  name: string
  status: PageStatus
  content: string
}
