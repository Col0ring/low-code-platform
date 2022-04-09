import { noop } from '@/utils'
import { createContext, useContext } from 'react'
import { ComponentRenderNode } from './type'

export interface EditorPropsContextState {
  onSave: (data: ComponentRenderNode[]) => void
}

export const EditorPropsContext = createContext<EditorPropsContextState>({
  onSave: noop,
})

export function useEditorPropsContext() {
  return useContext(EditorPropsContext)
}
