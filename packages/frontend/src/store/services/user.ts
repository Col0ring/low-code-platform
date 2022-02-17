import { createServiceApi } from './create-service-api'

export const userApi = createServiceApi({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
      providesTags: ['User'],
    }),
  }),
})

export const { useGetUserListQuery, useLazyGetUserListQuery } = userApi
