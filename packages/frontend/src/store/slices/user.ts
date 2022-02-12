import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { counterActions } from './counter'
function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

interface RouteState {
  roles: string[]
}

const setRoles = createAction('setRoles', withPayloadType<string[]>())

const initialState: RouteState = {
  roles: ['user'],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    [setRoles.type](state, { payload }: PayloadAction<string[]>) {
      state.roles = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(counterActions.increment, (state, action) => {
        return state
      })
      .addCase('ccc', (state) => {
        return state
      })
  },
})
export const { actions: userActions } = userSlice
