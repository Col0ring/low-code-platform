import { message } from 'antd'
import { createServiceApi } from '@/utils'
import { TokenPayload, User } from '@/features/auth/type'
import { authActions } from '@/features/auth/auth.slice'

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
    resetPassword: builder.mutation<
      void,
      {
        password: string
        code: string
        phone: string
      }
    >({
      query(data) {
        return {
          url: '/auth/resetPassword',
          method: 'post',
          body: data,
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          void message.success('修改密码成功，已自动跳转至登录页')
        } catch (error) {
          // do nothing
        }
      },
      invalidatesTags: (result) => (result ? ['Auth'] : []),
    }),
    // TODO
    getAuthCode: builder.mutation<
      {
        authCode: string
      },
      string
    >({
      queryFn: () => ({
        data: {
          authCode: 'xxxx',
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          void message.success({
            content: `验证码为 ${data.authCode}（忽略大小写）`,
          })
        } catch (error) {
          // do nothing
        }
      },
    }),
    login: builder.mutation<
      TokenPayload,
      { phone: string; passwordOrCode: string; type: 'password' | 'code' }
    >({
      query({ phone, passwordOrCode, type }) {
        return {
          url: `/auth/login?type=${type}`,
          method: 'post',
          body: {
            phone,
            passwordOrCode,
          },
        }
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(authActions.login(data))
          void message.success('登录成功')
        } catch (error) {
          // do nothing
        }
      },
      invalidatesTags: (result) => (result ? ['Auth'] : []),
    }),
    // for createServiceApi
    refreshToken: builder.mutation<TokenPayload, string>({
      query(refreshToken: string) {
        return {
          url: '/auth/refreshToken',
          method: 'post',
          meta: {
            notThrowError: true,
            isRefreshTokenRequest: true,
          },
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
          void message.success('登出成功')
        } catch (error) {
          // do noting
        }
      },
      invalidatesTags: (_, err) => (!err ? ['Auth'] : []),
    }),
    // for authRoute
    getUserInfo: builder.query<User, boolean | undefined>({
      query: (notThrowError = true) => ({
        url: '/auth/getUserInfo',
        meta: {
          notThrowError,
        },
      }),
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
  useResetPasswordMutation,
  useGetAuthCodeMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi
