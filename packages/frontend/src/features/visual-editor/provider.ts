import { createMethodsContext } from 'react-use-methods'
import { ArrayItem, StrictOmit } from 'types-kit'
import { createDraft, Draft, finishDraft } from 'immer'
import {
  ComponentRenderNode,
  ParentComponentRenderNode,
  UpdateComponentNodeOptions,
} from './type'
import {
  createNewNode,
  isParentComponentRenderNode,
} from './components/node-components'
import Page from './components/node-components/layout/page'

export interface EditorState {
  menuSelectedKeys: (string | number)[]
  componentNodes: ComponentRenderNode[]
  immerComponentNodes: Draft<ComponentRenderNode[]>
  immerComponentNodesMap: Record<string, Draft<ComponentRenderNode>>
  snapshots: {
    type: UpdateComponentNodeOptions['type']
    desc: string
    timestamp: number
    componentNodes: ComponentRenderNode[]
  }[]
  snapshotIndex: number
  isDragging: boolean
  moveNode: ComponentRenderNode | null
  moveParentNode: ParentComponentRenderNode | null
  actionNode: ComponentRenderNode | null
  hoveringNode: ComponentRenderNode | null
}

function getImmerComponentNodeMap(
  immerComponentNodes: Draft<ComponentRenderNode[]>
): Record<string, Draft<ComponentRenderNode>> {
  const componentNodesMap: Record<string, Draft<ComponentRenderNode>> = {}
  immerComponentNodes.forEach((node) => {
    componentNodesMap[node.id] = node
    if (node.children) {
      Object.assign(componentNodesMap, getImmerComponentNodeMap(node.children))
    }
  })
  return componentNodesMap
}

// TODO：初始化数据放在组件内部
const initialState: () => EditorState = () => {
  const initialPage = createNewNode(Page.nodeName)
  const componentNodes = [initialPage]
  const immerComponentNodes = createDraft(componentNodes)
  return {
    menuSelectedKeys: [],
    componentNodes,
    immerComponentNodes,
    immerComponentNodesMap: getImmerComponentNodeMap(immerComponentNodes),
    snapshots: [
      {
        componentNodes,
        type: 'init',
        timestamp: Date.now(),
        desc: '初始化数据',
      },
    ],
    snapshotIndex: 0,
    isDragging: false,
    moveParentNode: null,
    moveNode: null,
    actionNode: null,
    hoveringNode: null,
  }
}

export const { useEditorContext, EditorProvider } = createMethodsContext(
  (state) => ({
    methods: {
      startDragging(options: {
        moveNode: ComponentRenderNode
        moveParentNode: ParentComponentRenderNode
      }) {
        const changedEditorNodeState: EditorState = this.setActionNode(null)
        return {
          ...state,
          ...changedEditorNodeState,
          ...options,
          hoveringNode: null,
          isDragging: true,
        }
      },
      finishDragging(options?: { actionNode: ComponentRenderNode }) {
        const changedEditorNodeState: EditorState = options
          ? this.setActionNode(options.actionNode)
          : ({} as EditorState)
        return {
          ...state,
          ...changedEditorNodeState,
          ...options,
          isDragging: false,
          moveNode: null,
          moveParentNode: null,
        }
      },
      setActionNode(actionNode: ComponentRenderNode | null) {
        return {
          ...state,
          actionNode,
          menuSelectedKeys: actionNode ? [actionNode.id] : [],
        }
      },
      addSnapshot({
        type,
        componentNodes,
        desc,
      }: StrictOmit<ArrayItem<EditorState['snapshots']>, 'timestamp'>) {
        return {
          ...state,
          snapshots: [
            ...state.snapshots,
            {
              type,
              componentNodes,
              timestamp: Date.now(),
              desc,
            },
          ],
        }
      },
      setEditorState(payload: Partial<EditorState>) {
        return { ...state, ...payload }
      },
    },
    actions: {
      updateComponentNode(options: UpdateComponentNodeOptions) {
        return ({ dispatch }) => {
          const { immerComponentNodesMap, componentNodes } = state
          const { addSnapshot = true } = options
          let immerComponentNodes = state.immerComponentNodes
          if (options.type === 'init') {
            const { componentNodes: newComponentNodes } = options
            immerComponentNodes = createDraft(newComponentNodes)
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'init',
                    componentNodes: componentNodes,
                    desc: `init data`,
                  },
                ],
              })
          } else if (options.type === 'add') {
            const { newNode, index, parentNode } = options
            const immerParentNode = immerComponentNodesMap[parentNode.id]
            if (isParentComponentRenderNode(immerParentNode)) {
              immerParentNode.children.splice(index, 0, newNode)
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'add',
                      componentNodes: componentNodes,
                      desc: `add: ${newNode.title || newNode.name}`,
                    },
                  ],
                })
            }
            // if type is move
          } else if (options.type === 'move') {
            const {
              moveNode,
              moveParentNode,
              moveNodeIndex,
              nodeIndex,
              parentNode,
            } = options
            const immerParentNode = immerComponentNodesMap[parentNode.id]
            const immerMoveParentNode =
              immerComponentNodesMap[moveParentNode.id]
            if (
              isParentComponentRenderNode(immerParentNode) &&
              isParentComponentRenderNode(immerMoveParentNode)
            ) {
              if (moveParentNode === parentNode) {
                const children: (ComponentRenderNode | null)[] =
                  immerParentNode.children
                children[moveNodeIndex] = null
                children.splice(nodeIndex, 0, moveNode)
                immerParentNode.children = children.filter(
                  (n) => n !== null
                ) as ComponentRenderNode[]
              } else {
                immerMoveParentNode.children.splice(moveNodeIndex, 1)
                immerParentNode.children.splice(nodeIndex, 0, moveNode)
              }

              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'move',
                      componentNodes: componentNodes,
                      desc: `move: ${
                        moveParentNode.title || moveParentNode.name
                      } > ${moveNode.title || moveNode.name} => ${
                        parentNode.title || parentNode.name
                      } ${moveNode.title || moveNode.name}`,
                    },
                  ],
                })
            }
            // if type is update
          } else if (options.type === 'update') {
            const { node, props, children } = options
            const immerNode = immerComponentNodesMap[node.id]
            immerNode.props = props
            if (children && isParentComponentRenderNode(immerNode)) {
              immerNode.children = children
            }
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'update',
                    componentNodes: componentNodes,
                    desc: `update: ${node.title || node.name}`,
                  },
                ],
              })
          } else if (options.type === 'delete') {
            const { parentNode, node, index } = options
            const immerParentNode = immerComponentNodesMap[parentNode.id]
            if (isParentComponentRenderNode(immerParentNode)) {
              immerParentNode.children.splice(index, 1)
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'update',
                      componentNodes: componentNodes,
                      desc: `update: ${node.title || node.name}`,
                    },
                  ],
                })
            }
          }

          const newComponentNodes = finishDraft(immerComponentNodes)
          const newImmerComponentNodes = createDraft(newComponentNodes)
          const newImmerComponentNodesMap = getImmerComponentNodeMap(
            newImmerComponentNodes
          )
          dispatch({
            type: 'setEditorState',
            payload: [
              {
                componentNodes: newComponentNodes,
                immerComponentNodes: newImmerComponentNodes,
                immerComponentNodesMap: newImmerComponentNodesMap,
              } as Pick<
                EditorState,
                | 'componentNodes'
                | 'immerComponentNodes'
                | 'immerComponentNodesMap'
              >,
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
