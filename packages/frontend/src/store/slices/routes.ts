import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { staticRoutes } from '@/router/routes'

interface CounterState {
  value: number
}
const incrementBy = createAction<number>('incrementBy')
const initialState = { value: 0 } as CounterState

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    [incrementBy.type](state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
