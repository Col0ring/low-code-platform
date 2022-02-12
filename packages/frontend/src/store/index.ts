import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { userSlice, userActions } from './slices/user'
import { counterSlice, counterActions } from './slices/counter'

const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [counterSlice.name]: counterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}),
})

// setUp refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export { userActions, counterActions }
export default store
