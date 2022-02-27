import { createServiceApi } from '@/utils'

export const Design = createServiceApi({
  reducerPath: 'designApi',
  tagTypes: ['Design'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
    }),
  }),
})
