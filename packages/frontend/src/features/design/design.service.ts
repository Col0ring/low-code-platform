import { createServiceApi } from '@/utils'
import { Block } from './type'

export const designApi = createServiceApi({
  reducerPath: 'designApi',
  tagTypes: ['Block'],
  endpoints: (builder) => ({
    getBlockList: builder.query<{ data: Block[]; count: number }, string>({
      query: (search) => `/blocks/list?search=${search}`,
      providesTags: ['Block'],
    }),
    createBlock: builder.mutation<
      void,
      {
        name: string
        content: string
      }
    >({
      query: (data) => {
        return {
          url: '/blocks/create',
          method: 'post',
          body: data,
        }
      },
      invalidatesTags: (_result, error) => (!error ? ['Block'] : []),
    }),
    updateBlock: builder.mutation<
      void,
      {
        blockId: number
        name: string
      }
    >({
      query: ({ blockId, name }) => {
        return {
          url: `/blocks/update/${blockId}`,
          method: 'put',
          body: { name },
        }
      },
      invalidatesTags: (_result, error) => (!error ? ['Block'] : []),
    }),
    deleteBlock: builder.mutation<void, number>({
      query: (blockId) => {
        return {
          url: `/blocks/delete/${blockId}`,
          method: 'delete',
        }
      },
      invalidatesTags: (_result, error) => (!error ? ['Block'] : []),
    }),
  }),
})

export const {
  useCreateBlockMutation,
  useDeleteBlockMutation,
  useGetBlockListQuery,
  useUpdateBlockMutation,
} = designApi
