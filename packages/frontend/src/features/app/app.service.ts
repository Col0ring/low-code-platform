import { createServiceApi } from '@/utils'

export const Design = createServiceApi({
  reducerPath: 'appApi',
  tagTypes: ['App'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
    }),
  }),
})
