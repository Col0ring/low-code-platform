import { createMethodsContext } from 'react-use-methods'
import { createDraft, finishDraft } from 'immer'
import { ComponentRenderNode } from './type'

export interface EditorState {
  componentNodes: ComponentRenderNode[]
  immerComponentNodes: ComponentRenderNode[]
  isDragging: boolean
  actionNode: ComponentRenderNode | null
}

const initialState: EditorState = {
  componentNodes: [],
  immerComponentNodes: createDraft([]),
  isDragging: false,
  actionNode: null,
}

export const { useEditorContext, EditorProvider } = createMethodsContext(
  (state) => ({
    methods: {
      setEditorState(payload: Partial<EditorState>) {
        return { ...state, ...payload }
      },
    },
    actions: {
      updateComponentNode(
        recipe: (draft: ComponentRenderNode[]) => void | Promise<void>
      ) {
        return async ({ dispatch }) => {
          await recipe(state.immerComponentNodes)
          const newComponentNodes = finishDraft(state.immerComponentNodes)
          dispatch({
            type: 'setEditorState',
            payload: [
              {
                componentNodes: newComponentNodes,
                immerComponentNodes: createDraft(newComponentNodes),
                isDragging: true,
              } as Pick<EditorState, 'componentNodes' | 'immerComponentNodes'>,
            ],
          })
        }
      },
    },
  }),
  initialState,
  {
    name: 'editor',
  }
)
