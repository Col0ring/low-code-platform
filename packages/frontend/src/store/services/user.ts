import { createServiceApi } from './create-service-api'

export const userApi = createServiceApi({
  reducerPath: 'userApi',
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, void>({
      query: () => '/auth/getUserList',
      providesTags: ['user'],
    }),
  }),
})

export const { useGetUserListQuery, useLazyGetUserListQuery } = userApi
