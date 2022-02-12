import {} from './user'
import { baseApi } from './base'

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query(data) {
        return {
          url: '/login',
          method: 'post',
          body: data,
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled
        } catch (error) {
          console.log(error)
        }
      },
      invalidatesTags: ['auth'],
    }),
    getUserInfo: builder.query<void, {}>({
      query: () => '/getUserInfo',
      providesTags: ['auth'],
    }),
  }),
})
