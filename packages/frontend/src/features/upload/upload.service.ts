import { createServiceApi } from '@/store/createServiceApi'

export const uploadApi = createServiceApi({
  reducerPath: '/uploadApi',
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ url: string }, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData()
        formData.append('file', file)

        return {
          url: '/common/upload',
          method: 'post',
          body: formData,
        }
      },
    }),
  }),
})

export const { useUploadFileMutation } = uploadApi
