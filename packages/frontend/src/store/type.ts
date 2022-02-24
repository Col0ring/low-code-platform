import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react'

export interface ResponseError {
  message: string
  status: number
  notThrowError?: boolean
}

export interface ResultData<T = any> {
  data: T
}
export interface ResultError {
  error: FetchBaseQueryError | SerializedError
}

export type ResponseResult<T = any> = ResultData<T> | ResultError
