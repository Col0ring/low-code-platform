import { noop } from '@/utils'
import { createContext, useContext } from 'react'
import { PageRenderNode } from './type'

export interface EditorPropsContextState {
  onSave: (data: PageRenderNode) => void
}

export const EditorPropsContext = createContext<EditorPropsContextState>({
  onSave: noop,
})

export function useEditorPropsContext() {
  return useContext(EditorPropsContext)
}
