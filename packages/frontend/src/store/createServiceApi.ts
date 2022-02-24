import {
  createApi,
  CreateApiOptions,
  EndpointDefinitions,
  FetchArgs,
  fetchBaseQuery,
  retry,
} from '@reduxjs/toolkit/query/react'
import { authActions } from '@/features/auth/auth.slice'
import { TokenPayload } from '@/features/auth/type'
import { isResolved } from '@/utils'
import { RootState } from '.'
import { ResponseResult, ResponseError } from './type'
import { HttpStatus } from './constants'

// lazy load
const lazyAuthApi = import('@/features/auth/auth.service').then(
  ({ authApi }) => authApi
)

let isRefreshingToken: Promise<ResponseResult<TokenPayload>> | null = null

export interface ServiceFetchArgs extends FetchArgs {
  meta?: {
    notThrowError?: boolean
    isRefreshTokenRequest?: boolean
  }
}

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

function getIsRefreshTokenRequest(args: string | ServiceFetchArgs) {
  return typeof args === 'string' ? false : !!args.meta?.isRefreshTokenRequest
}

const baseServiceQueryWithReAuth = retry(
  async (args: string | ServiceFetchArgs, api, extraOptions) => {
    // 如果是 refreshToken 的请求，不要等待
    const isRefreshTokenRequest = getIsRefreshTokenRequest(args)
    if (!isRefreshTokenRequest) {
      await isRefreshingToken
    }

    let result = await baseServiceQuery(args, api, extraOptions)
    const { error } = result

    if (error) {
      if (typeof args !== 'string') {
        if (args.meta?.notThrowError) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(error.data as ResponseError).notThrowError = true
        }
      }
      // 不在这里打印 message 给用户，因为重新请求可能会发送多次，应该创建 rtkQueryErrorLogger 中间件处理
      if (error.status === HttpStatus.Unauthorized) {
        const { auth } = api.getState() as RootState
        if (isRefreshTokenRequest) {
          retry.fail(error)
        } else {
          // 上面的 await 是为了等待 refresh token 完毕，这里是为了获取值
          let refreshResult = await isRefreshingToken
          if (!refreshResult) {
            // 当有 refreshToken 时保存本地时发起请求
            if (auth.refreshToken) {
              isRefreshingToken = new Promise((resolve) => {
                lazyAuthApi
                  .then((authApi) => {
                    api
                      .dispatch(
                        authApi.endpoints.refreshToken.initiate(
                          auth.refreshToken
                        )
                      )
                      .then((res) => {
                        resolve(res)
                      })
                      .catch((err) => {
                        resolve(err)
                      })
                  })
                  .catch((err) => resolve(err))
              })
            }
            // try to get a new token
            refreshResult = await isRefreshingToken
            isRefreshingToken = null
            if (refreshResult && isResolved(refreshResult)) {
              // store the new token
              api.dispatch(authActions.login(refreshResult.data))
              // retry the initial query
              result = await baseServiceQuery(args, api, extraOptions)
            } else {
              api.dispatch(authActions.logout())
              retry.fail(error)
            }
          } else {
            // 几个已经在请求中的请求报 401
            if (refreshResult && isResolved(refreshResult)) {
              result = await baseServiceQuery(args, api, extraOptions)
            } else {
              retry.fail(error)
            }
          }
        }
      } else if (
        error.status === HttpStatus.Forbidden ||
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
