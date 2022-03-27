import { createMethodsContext } from 'react-use-methods'
import { ComponentRenderNode } from './type'

export interface EditorStateProps {
  componentNodes: ComponentRenderNode[]
}

const initialState = {}

export const { useEditorContext, EditorProvider } = createMethodsContext(
  (state) => ({}),
  {},
  { name: 'editor' }
)
