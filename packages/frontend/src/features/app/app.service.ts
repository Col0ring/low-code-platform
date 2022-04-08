import { createServiceApi } from '@/utils'
import { StrictOmit } from 'types-kit'
import { SearchAppStatus } from '../main/constants'
import { App } from '../main/type'
import { Page } from './type'

const LIST = 'LIST'

export const appApi = createServiceApi({
  reducerPath: 'appApi',
  tagTypes: ['App', 'Page'],
  endpoints: (builder) => ({
    getAppList: builder.query<
      {
        data: App[]
        count: number
      },
      {
        page: number
        pageSize: number
        searchOptions: {
          search: string
          searchOrder: 'update' | 'create'
          searchStatus: SearchAppStatus
        }
      }
    >({
      query: ({ page, pageSize, searchOptions }) => ({
        method: 'post',
        url: `/apps/list?page=${page}&pageSize=${pageSize}`,
        body: searchOptions,
      }),
      providesTags: [
        {
          type: 'App',
          id: LIST,
        },
      ],
    }),
    createApp: builder.mutation<void, StrictOmit<App, 'id'>>({
      query: (values) => ({
        method: 'post',
        url: '/apps/create',
        body: values,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'App', id: LIST }] : []),
    }),
    updateApp: builder.mutation<void, App>({
      query: ({ id, ...data }) => ({
        method: 'put',
        url: `/apps/update/${id}`,
        body: data,
      }),
      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: 'App', id: LIST },
              { type: 'App', id: arg.id },
            ]
          : [],
    }),
    deleteApp: builder.mutation<void, string>({
      query: (appId) => ({
        method: 'delete',
        url: `/apps/delete/${appId}`,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'App', id: LIST }] : []),
    }),
    getAppDetail: builder.query<
      App & {
        pages: Page[]
      },
      number
    >({
      query: (appId) => `/apps/one/${appId}`,
      providesTags: (_result, _error, arg) => [{ type: 'App', id: arg }],
    }),
    createPage: builder.mutation<
      Page,
      {
        name: string
        appId: number
      }
    >({
      query: (data) => {
        return {
          method: 'post',
          url: '/pages/create',
          body: data,
        }
      },
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: 'App', id: arg.appId }] : [],
    }),
    getPageDetail: builder.query<
      Page & {
        app: App
      },
      { appId: number; pageId: number }
    >({
      query: ({ pageId, appId }) => `/pages/one/${appId}/${pageId}`,
      providesTags: (_result, _error, arg) => [
        { type: 'Page', id: arg.pageId },
      ],
    }),
    updatePage: builder.mutation<
      void,
      {
        appId: number
        pageId: number
        data: Partial<Page>
      }
    >({
      query: ({ appId, pageId, data }) => ({
        method: 'put',
        url: `/pages/update/${appId}/${pageId}`,
        body: data,
      }),
      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: 'Page', id: arg.pageId },
              { type: 'App', id: arg.appId },
            ]
          : [],
    }),
    deletePage: builder.mutation<void, { pageId: number; appId: number }>({
      query: ({ pageId, appId }) => ({
        method: 'delete',
        url: `/pages/delete/${appId}/${pageId}`,
      }),
      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: 'Page', id: arg.pageId },
              { type: 'App', id: arg.appId },
            ]
          : [],
    }),
  }),
})

export const {
  useGetAppListQuery,
  useCreateAppMutation,
  useDeleteAppMutation,
  useUpdateAppMutation,
  useGetAppDetailQuery,
  useCreatePageMutation,
  useGetPageDetailQuery,
  useDeletePageMutation,
  useUpdatePageMutation,
} = appApi
