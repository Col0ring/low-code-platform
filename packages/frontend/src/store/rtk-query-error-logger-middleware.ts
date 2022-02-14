import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react'
import { message } from 'antd'
import { ResponseError } from './type'
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as FetchBaseQueryError
    const errorData = error.data as ResponseError
    void message.error(errorData.message || 'Server Error')
  }
  return next(action)
}
