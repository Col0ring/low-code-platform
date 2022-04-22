import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createLocalStorage, withPayloadType } from '@/utils'
import { PayloadFromAction, TokenPayload, User } from './type'
import { Role } from './constants'

const { setTokenStorage, getTokenStorage, removeTokenStorage } =
  createLocalStorage('tokenStorage', {
    defaultValue: '',
  })

const {
  setRefreshTokenStorage,
  getRefreshTokenStorage,
  removeRefreshTokenStorage,
} = createLocalStorage('refreshTokenStorage', {
  defaultValue: '',
})

export interface AuthState {
  roles: Role[]
  token: string
  refreshToken: string
  user: User | null
}

const login = createAction('login', withPayloadType<TokenPayload>())
const setUser = createAction('setUser', withPayloadType<any>())
const logout = createAction('logout')

const initialState: () => AuthState = () => ({
  roles: [],
  token: getTokenStorage(),
  refreshToken: getRefreshTokenStorage(),
  user: null,
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    [login.type](
      state,
      { payload }: PayloadAction<PayloadFromAction<typeof login>>
    ) {
      const { token, refreshToken } = payload
      state.token = token
      state.refreshToken = refreshToken
      setTokenStorage(token)
      setRefreshTokenStorage(refreshToken)
    },
    [setUser.type](
      state,
      { payload }: PayloadAction<PayloadFromAction<typeof setUser>>
    ) {
      state.user = payload
      state.roles = payload.roles
    },
    [logout.type]() {
      removeTokenStorage()
      removeRefreshTokenStorage()
      setTimeout(() => {
        window.location.reload()
      }, 200)
      // return initialState()
    },
  },
})
export const { actions: authActions } = authSlice
