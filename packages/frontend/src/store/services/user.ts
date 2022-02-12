import { createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface Pokemon {
  name: string
}

const messagesAdapter = createEntityAdapter<string[]>()
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  // 声明标签类型
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    // 定义查询
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
      // 查询接口提供的标签
      providesTags: (pokemon) => [{ type: 'Pokemon', id: pokemon?.name }],
    }),
    // 定义突变
    updatePokemonByName: builder.mutation<Pokemon, Partial<Pokemon>>({
      query(data) {
        const { name, ...body } = data
        return {
          url: `post/${name}`,
          method: 'post',
          body,
        }
      },
      // async onQueryStarted(arg, { dispatch }) {
      //   const res = dispatch(
      //     pokemonApi.util.updateQueryData('getPokemonByName', {}, () => {})
      //   )
      // },
      // 更新会使提供了这些标签的查询失效...
      invalidatesTags: (result, error, arg) => [
        { type: 'Pokemon', id: arg.name },
      ],
    }),
  }),
})

const { useGetPokemonByNameQuery } = pokemonApi
type Push<T extends readonly any[]> = T extends any[] ? T : never
type C = Push<readonly [1, 2]>
