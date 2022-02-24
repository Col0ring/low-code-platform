import { createAction } from '@reduxjs/toolkit'
import { Role } from './constants'

// rtk
export interface User {
  id: number
  phone: string
  username: string
  roles: Role[]
}

export type PayloadFromAction<A extends ReturnType<typeof createAction>> =
  ReturnType<A>['payload']

export interface TokenPayload {
  token: string
  refreshToken: string
}
