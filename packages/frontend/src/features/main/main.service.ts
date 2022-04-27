import { createServiceApi } from '@/utils'
import { StrictOmit } from 'types-kit'
import { App, Template } from './type'

export const mainApi = createServiceApi({
  reducerPath: 'mainApi',
  tagTypes: ['Template'],
  endpoints: (builder) => ({
    createTemplate: builder.mutation<
      void,
      StrictOmit<App, 'id'> & {
        appId: number
      }
    >({
      query: (values) => {
        return {
          url: '/templates/create',
          method: 'post',
          body: values,
        }
      },
      invalidatesTags: (result) => (result ? ['Template'] : []),
    }),
    updateTemplate: builder.mutation<
      void,
      StrictOmit<App, 'id'> & {
        templateId: number
      }
    >({
      query: ({ templateId, ...values }) => {
        return {
          url: `/templates/update/${templateId}`,
          method: 'put',
          body: values,
        }
      },
      invalidatesTags: (result) => (result ? ['Template'] : []),
    }),
    getTemplateList: builder.query<
      {
        data: Template[]
        count: number
      },
      {
        page: number
        pageSize: number
        search: string
      }
    >({
      query: ({ page, pageSize, search }) => {
        return {
          url: `/templates/list?page=${page}&pageSize=${pageSize}&search=${search}`,
        }
      },
      providesTags: ['Template'],
    }),
    getMyTemplateList: builder.query<
      {
        data: Template[]
        count: number
      },
      {
        page: number
        pageSize: number
        search: string
      }
    >({
      query: ({ page, pageSize, search }) => {
        return {
          url: `/templates/myList?page=${page}&pageSize=${pageSize}&search=${search}`,
        }
      },
      providesTags: ['Template'],
    }),
  }),
})

export const {
  useGetTemplateListQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useGetMyTemplateListQuery,
} = mainApi
