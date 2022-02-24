import { createServiceApi } from '@/utils'

export const editorApi = createServiceApi({
  reducerPath: 'editorApi',
  tagTypes: ['Editor'],
  endpoints: (builder) => ({
    getUserList: builder.query<any, number>({
      query: (page) => `/auth/getUserList?page=${page}`,
    }),
  }),
})
