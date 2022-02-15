import { createServiceApi } from './create-service-api'
import { TokenPayload } from '../type'
import { authActions } from '../slices/auth'

export const authApi = createServiceApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation<
      TokenPayload,
      { phone: string; username: string; password: string }
    >({
      query(data) {
        return {
          url: '/auth/register',
          method: 'post',
          body: data,
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(authActions.login(data))
        } catch (error) {
          // do nothing
        }
      },
      invalidatesTags: (result) => (result ? ['Auth'] : []),
    }),
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
        try {
          const { data } = await queryFulfilled
          dispatch(authActions.login(data))
        } catch (error) {
          // do nothing
        }
      },
      invalidatesTags: (result) => (result ? ['Auth'] : []),
    }),
    refreshToken: builder.mutation<TokenPayload, string>({
      query(refreshToken: string) {
        return {
          url: '/auth/refreshToken',
          method: 'post',
          headers: {
            authorization: `Bearer ${refreshToken}`,
          },
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(authActions.login(data))
        } catch (error) {
          // do nothing
        }
      },
      invalidatesTags: (result) => (result ? ['Auth'] : []),
    }),
    logout: builder.mutation<void, void>({
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
      invalidatesTags: (result) => (result ? ['Auth'] : []),
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
      providesTags: ['Auth'],
    }),
  }),
})

export const {
  useGetUserInfoQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi
