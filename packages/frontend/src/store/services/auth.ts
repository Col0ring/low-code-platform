import { createServiceApi } from './create-service-api'
import { TokenPayload } from '../type'
import { authActions } from '../slices/auth'

export const authApi = createServiceApi({
  reducerPath: 'authApi',
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      TokenPayload,
      { username: string; password: string }
    >({
      query(data) {
        return {
          url: '/auth/login',
          method: 'post',
          body: data,
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        // no need error handler
        const { data } = await queryFulfilled
        dispatch(authActions.login(data))
      },
      invalidatesTags: ['auth'],
    }),
    refreshToken: builder.mutation<void, string>({
      query(refreshToken: string) {
        return {
          url: '/auth/refreshToken',
          method: 'post',
          headers: {
            authorization: `Bearer ${refreshToken}`,
          },
        }
      },
      invalidatesTags: ['auth'],
    }),
    logout: builder.mutation({
      query() {
        return {
          url: '/auth/logout',
          method: 'post',
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
          dispatch(authActions.logout())
        } catch (error) {
          // do noting
        }
      },
      invalidatesTags: ['auth'],
    }),
    getUserInfo: builder.query<any, void>({
      query: () => '/auth/getUserInfo',
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(authActions.setUser(data))
        } catch (error) {
          // do nothing
        }
      },
      providesTags: ['auth'],
    }),
  }),
})

export const { useGetUserInfoQuery, useLoginMutation, useLogoutMutation } =
  authApi
