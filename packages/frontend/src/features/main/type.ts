import { AppStatus } from './constants'

export interface App {
  id: string
  name: string
  icon: string
  desc: string
  status: AppStatus
}
