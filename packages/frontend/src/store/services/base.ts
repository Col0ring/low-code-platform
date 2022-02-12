import {
  createApi,
  fetchBaseQuery,
  CreateApiOptions,
  EndpointDefinitions,
} from '@reduxjs/toolkit/query/react'

const baseServiceQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5000' })

export interface CreateServiceApiOptions<
  Definitions extends EndpointDefinitions,
  ReducerPath extends string,
  TagTypes extends string = never,
  ApiOptions extends CreateApiOptions<
    typeof baseServiceQuery,
    Definitions,
    ReducerPath,
    TagTypes
  > = CreateApiOptions<
    typeof baseServiceQuery,
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
    baseQuery: baseServiceQuery,
    // 单位是秒，默认为 false，不会自动刷新，此配置当经过对应时间后调用自动刷新
    refetchOnMountOrArgChange: 30 * 60, // 30 minutes
    ...options,
  })
}

const authApi = createServiceApi({
  reducerPath: 'authApi',
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query() {
        return {
          url: 'login',
        }
      },
    }),
  }),
})

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  // 单位是秒，默认为 false，不会自动刷新，此配置当经过对应时间后调用自动刷新
  refetchOnMountOrArgChange: 30 * 60, // 30 minutes
  endpoints: () => ({}),
  tagTypes: ['auth'],
})
