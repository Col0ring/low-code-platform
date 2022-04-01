import { createMethodsContext } from 'react-use-methods'
import { createDraft, finishDraft } from 'immer'
import { BaseLayoutProps, ComponentRenderNode } from './type'
import { getComponentNode } from './components/node-components'

export interface EditorState {
  componentNodes: ComponentRenderNode[]
  immerComponentNodes: ComponentRenderNode[]
  isDragging: boolean
  moveNode: ComponentRenderNode | null
  immerMoveParentNode: ComponentRenderNode<BaseLayoutProps> | null
  actionNode: ComponentRenderNode | null
  hoveringNode: ComponentRenderNode | null
}

function getInitialPage(): ComponentRenderNode {
  const { component, title } = getComponentNode('page')
  return {
    title,
    name: 'page',
    props: component.getInitialProps(),
    id: component.getId(),
  }
}

const initialState: () => EditorState = () => {
  const initialPage = getInitialPage()
  const componentNodes = [initialPage]
  return {
    componentNodes,
    immerComponentNodes: createDraft(componentNodes),
    isDragging: false,
    moveNode: null,
    immerMoveParentNode: null,
    actionNode: null,
    hoveringNode: null,
  }
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
          const res = recipe(state.immerComponentNodes)
          if (res instanceof Promise) {
            await res
          }
          const newComponentNodes = finishDraft(state.immerComponentNodes)
          console.log(newComponentNodes)
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
    effects: {
      componentNodes(dispatch, newValue) {
        // console.log(newValue)
      },
    },
  }),
  initialState,
  {
    name: 'editor',
  }
)
