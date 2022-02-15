import {
  createApi,
  CreateApiOptions,
  EndpointDefinitions,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  retry,
} from '@reduxjs/toolkit/query/react'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers'
import { authActions } from '../slices/auth'
import { ResponseError, TokenPayload } from '../type'
import { HttpStatus } from './constants'
import { RootState } from '..'
import { authApi } from './auth'

let isRefreshingToken: Promise<
  MaybePromise<
    QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  >
> | null = null

const baseServiceQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders(headers, { getState }) {
    const { auth } = getState() as RootState
    if (auth && auth.token) {
      if (!headers.has('authorization')) {
        headers.set('authorization', `Bearer ${auth.token}`)
      }
    }
    return headers
  },
})

function getIsRefreshTokenRequest(args: string | FetchArgs) {
  return typeof args === 'string'
    ? args.includes('/auth/refreshToken')
    : args.url.includes('/auth/refreshToken')
}

const baseServiceQueryWithReAuth = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const isRefreshTokenRequest = getIsRefreshTokenRequest(args)
    if (!isRefreshTokenRequest) {
      await isRefreshingToken
    }

    let result = await baseServiceQuery(args, api, extraOptions)
    const { error } = result

    if (error) {
      // 不在这里打印 message 给用户，因为重新请求可能会发送多次，应该创建 rtkQueryErrorLogger 中间件处理
      if (error.status === HttpStatus.Unauthorized) {
        if (isRefreshTokenRequest) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(error.data as ResponseError).noThrowError = true
          retry.fail(error)
        } else {
          const { auth } = api.getState() as RootState
          if (!isRefreshingToken) {
            isRefreshingToken = new Promise((resolve) => {
              api
                .dispatch(
                  authApi.endpoints.refreshToken.initiate(auth.refreshToken)
                )
                .then((res) => {
                  resolve(
                    res as QueryReturnValue<
                      unknown,
                      FetchBaseQueryError,
                      FetchBaseQueryMeta
                    >
                  )
                })
                .catch((err) => {
                  resolve(err)
                })
            })
            // try to get a new token
            const refreshResult = await isRefreshingToken
            isRefreshingToken = null
            if (refreshResult?.data) {
              // store the new token
              api.dispatch(
                authActions.login(refreshResult.data as TokenPayload)
              )
              // retry the initial query
              result = await baseServiceQuery(args, api, extraOptions)
            } else {
              // api.dispatch(authActions.logout())
              retry.fail(error)
            }
          } else {
            // 几个已经在请求中的请求报 401
            const refreshResult = await isRefreshingToken
            if (refreshResult?.data) {
              result = await baseServiceQuery(args, api, extraOptions)
            } else {
              retry.fail(error)
            }
          }
        }
      } else if (
        error.status === HttpStatus.BadRequest ||
        error.status === HttpStatus.NotFound
      ) {
        retry.fail(error)
      }
    }
    return result
  },
  {
    maxRetries: 3,
  }
)

export interface CreateServiceApiOptions<
  Definitions extends EndpointDefinitions,
  ReducerPath extends string,
  TagTypes extends string = never,
  ApiOptions extends CreateApiOptions<
    typeof baseServiceQueryWithReAuth,
    Definitions,
    ReducerPath,
    TagTypes
  > = CreateApiOptions<
    typeof baseServiceQueryWithReAuth,
    Definitions,
    ReducerPath,
    TagTypes
  >
> {
  reducerPath: NonNullable<ApiOptions['reducerPath']>
  tagTypes?: ApiOptions['tagTypes']
  endpoints: ApiOptions['endpoints']
}

export function createServiceApi<
  Definitions extends EndpointDefinitions,
  ReducerPath extends string,
  TagTypes extends string = never
>(options: CreateServiceApiOptions<Definitions, ReducerPath, TagTypes>) {
  return createApi({
    baseQuery: baseServiceQueryWithReAuth,
    // window 重新聚集时发起请求
    refetchOnFocus: false,
    // 网络重新链接时获取
    refetchOnReconnect: true,
    // 单位是秒，默认为 false，不会自动刷新，此配置当经过对应时间后调用自动刷新
    refetchOnMountOrArgChange: 30 * 60, // 30 minutes
    ...options,
  })
}
