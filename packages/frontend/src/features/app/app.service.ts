import { createServiceApi } from '@/utils'

export const appApi = createServiceApi({
  reducerPath: 'appApi',
  tagTypes: ['App'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
    }),
  }),
})
