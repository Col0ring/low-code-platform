import { noop } from '@/utils'
import { createContext, useContext } from 'react'
import { Block } from '../design/type'
import { PageRenderNode } from './type'

export interface EditorPropsContextState {
  onSave: (data: PageRenderNode) => void
  onBlockSearch: (search: string) => void
  onBlockAdd: (block: { name: string; content: string }) => void
  onBlockUpdate: (data: { blockId: number; name: string }, block: Block) => void
  onBlockDelete: (data: { blockId: number }, block: Block) => void
  blocks: Block[]
}

export const EditorPropsContext = createContext<EditorPropsContextState>({
  blocks: [],
  onSave: noop,
  onBlockAdd: noop,
  onBlockDelete: noop,
  onBlockUpdate: noop,
  onBlockSearch: () => Promise.resolve([]),
})

export function useEditorPropsContext() {
  return useContext(EditorPropsContext)
}
