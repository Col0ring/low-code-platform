import { createServiceApi } from '@/utils'

export const MainApi = createServiceApi({
  reducerPath: 'mainApi',
  tagTypes: ['App'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
    }),
  }),
})
