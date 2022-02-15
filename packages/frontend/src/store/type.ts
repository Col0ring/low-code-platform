import { createAction } from '@reduxjs/toolkit'

// query
export interface ResponseError {
  message: string
  status: number
  noThrowError?: boolean
}

// rtk
export type PayloadFromAction<A extends ReturnType<typeof createAction>> =
  ReturnType<A>['payload']

export interface TokenPayload {
  token: string
  refreshToken: string
}
