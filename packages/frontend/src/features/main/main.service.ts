import { createServiceApi } from '@/utils'

export const mainApi = createServiceApi({
  reducerPath: 'mainApi',
  tagTypes: ['App'],
  endpoints: (builder) => ({}),
})
