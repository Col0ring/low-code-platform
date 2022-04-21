import { createServiceApi } from '@/store/createServiceApi'

export const uploadApi = createServiceApi({
  reducerPath: '/uploadApi',
  endpoints: (builder) => ({
    uploadFile: builder.mutation<void, void>({
      query: () => {
        return {
          url: '',
          method: 'post',
        }
      },
    }),
  }),
})

export const { useUploadFileMutation } = uploadApi
