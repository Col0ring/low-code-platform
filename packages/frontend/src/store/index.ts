import logger from 'redux-logger'
import { configureStore, Middleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { __DEV__ } from '@/utils'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authSlice } from '@/features/auth/auth.slice'
import { authApi } from '@/features/auth/auth.service'
import { userApi } from '@/features/user/user.service'
import { rtkQueryErrorLogger } from './rtk-query-error-logger-middleware'
import { mainApi } from '@/features/main/main.service'
import { appApi } from '@/features/app/app.service'

function setupStore() {
  const devMiddlewares: Middleware[] = []
  const prodMiddlewares: Middleware[] = [rtkQueryErrorLogger]
  const apiMiddlewares: Middleware[] = [
    authApi.middleware,
    userApi.middleware,
    mainApi.middleware,
    appApi.middleware,
  ]
  const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [mainApi.reducerPath]: mainApi.reducer,
      [appApi.reducerPath]: appApi.reducer,
      [authSlice.name]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      if (__DEV__) {
        return getDefaultMiddleware().concat(
          ...apiMiddlewares,
          ...devMiddlewares,
          ...prodMiddlewares
        )
      }
      return getDefaultMiddleware().concat(
        ...apiMiddlewares,
        ...prodMiddlewares
      )
    },
  })

  // setUp refetchOnFocus and refetchOnReconnect
  setupListeners(store.dispatch)

  return store
}

const store = setupStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
export * from './constants'
export * from './type'
