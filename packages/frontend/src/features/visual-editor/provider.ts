import { createMethodsContext } from 'react-use-methods'
import { ArrayItem, StrictOmit } from 'types-kit'
import { createDraft, Draft, finishDraft, isDraft } from 'immer'
import {
  ComponentRenderNode,
  ParentComponentRenderNode,
  UpdateComponentNodeOptions,
} from './type'
import { isParentComponentRenderNode } from './components/node-components'

export interface EditorState {
  menuSelectedKeys: (string | number)[]
  componentNodes: ComponentRenderNode[]
  currentScreen: ComponentRenderNode | null
  componentNodesMap: Record<
    string,
    {
      node: ComponentRenderNode
      parentNodes: ParentComponentRenderNode[]
    }
  >
  immerComponentNodes: Draft<ComponentRenderNode[]>
  immerComponentNodesMap: Record<string, Draft<ComponentRenderNode>>
  snapshots: {
    type: UpdateComponentNodeOptions['type']
    desc: string
    timestamp: number
    actionNode: ComponentRenderNode | null
    currentScreen: ComponentRenderNode | null
    componentNodes: ComponentRenderNode[]
  }[]
  snapshotIndex: number
  isDragging: boolean
  moveNode: ComponentRenderNode | null
  moveParentNode: ParentComponentRenderNode | null
  actionNode: ComponentRenderNode | null
  hoveringNode: ComponentRenderNode | null
}

function getComponentNodeMap(
  componentNodes: ComponentRenderNode[],
  parentNodes: ParentComponentRenderNode[] = []
): EditorState['componentNodesMap'] {
  const componentNodesMap: EditorState['componentNodesMap'] = {}
  componentNodes.forEach((node) => {
    componentNodesMap[node.id] = {
      node,
      parentNodes,
    }
    if (node.children) {
      Object.assign(
        componentNodesMap,
        getComponentNodeMap(node.children, [
          ...parentNodes,
          node as ParentComponentRenderNode,
        ])
      )
    }
  })
  return componentNodesMap
}

function getImmerComponentNodeMap(
  immerComponentNodes: Draft<ComponentRenderNode[]>
): EditorState['immerComponentNodesMap'] {
  const immerComponentNodesMap: EditorState['immerComponentNodesMap'] = {}
  immerComponentNodes.forEach((node) => {
    immerComponentNodesMap[node.id] = node
    if (node.children) {
      Object.assign(
        immerComponentNodesMap,
        getImmerComponentNodeMap(node.children)
      )
    }
  })
  return immerComponentNodesMap
}

// TODO：初始化数据放在组件内部
const initialState: () => EditorState = () => {
  const componentNodes: ComponentRenderNode[] = []
  const immerComponentNodes = createDraft(componentNodes)
  return {
    menuSelectedKeys: [],
    componentNodes,
    currentScreen: null,
    immerComponentNodes,
    immerComponentNodesMap: getImmerComponentNodeMap(immerComponentNodes),
    componentNodesMap: getComponentNodeMap(componentNodes),
    snapshots: [],
    snapshotIndex: -1,
    isDragging: false,
    moveParentNode: null,
    moveNode: null,
    actionNode: null,
    hoveringNode: null,
  }
}

export const { useEditorContext, withEditorProvider } = createMethodsContext(
  (state, getState) => ({
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
          snapshotIndex: state.snapshotIndex + 1,
          snapshots:
            state.snapshotIndex !== state.snapshots.length - 1
              ? [
                  ...state.snapshots.slice(0, state.snapshotIndex + 1),
                  {
                    type,
                    componentNodes,
                    timestamp: Date.now(),
                    desc,
                    actionNode: state.actionNode,
                    currentScreen: state.currentScreen,
                  },
                ]
              : [
                  ...state.snapshots,
                  {
                    type,
                    componentNodes,
                    timestamp: Date.now(),
                    desc,
                    actionNode: state.actionNode,
                    currentScreen: state.currentScreen,
                  },
                ],
        }
      },
      changeSnapShot(snapshotIndex: number) {
        if (snapshotIndex < 0) {
          return state
        } else if (snapshotIndex >= state.snapshots.length) {
          return state
        }
        const { componentNodes, currentScreen, actionNode } =
          state.snapshots[snapshotIndex]
        const changedState: EditorState = this.setComponentNodes(componentNodes)
        return {
          ...state,
          ...changedState,
          currentScreen,
          snapshotIndex,
          actionNode,
        }
      },
      setCurrentScreen(currentScreen: ComponentRenderNode | null) {
        return { ...state, currentScreen }
      },
      setComponentNodes(
        componentNodesOrimmerComponentNodes?:
          | ComponentRenderNode[]
          | Draft<ComponentRenderNode[]>
      ) {
        const newComponentNodes = isDraft(
          componentNodesOrimmerComponentNodes || state.immerComponentNodes
        )
          ? finishDraft(
              componentNodesOrimmerComponentNodes || state.immerComponentNodes
            )
          : (componentNodesOrimmerComponentNodes as ComponentRenderNode[])
        const newImmerComponentNodes = createDraft(newComponentNodes)
        const newComponentNodesMap = getComponentNodeMap(newComponentNodes)
        const newImmerComponentNodesMap = getImmerComponentNodeMap(
          newImmerComponentNodes
        )
        return {
          ...state,
          componentNodes: newComponentNodes,
          immerComponentNodes: newImmerComponentNodes,
          componentNodesMap: newComponentNodesMap,
          immerComponentNodesMap: newImmerComponentNodesMap,
        }
      },
      setEditorState(payload: Partial<EditorState>) {
        return { ...state, ...payload }
      },
    },
    actions: {
      updateScreen({
        screen,
        type,
      }: {
        screen: ComponentRenderNode
        type: 'add' | 'change' | 'clear' | 'delete'
      }) {
        return ({ dispatch }) => {
          const { immerComponentNodes, componentNodes } = state
          if (type === 'add') {
            immerComponentNodes.push(screen)
            dispatch({
              type: 'setCurrentScreen',
              payload: [screen],
            })
            dispatch({
              type: 'setActionNode',
              payload: [screen],
            })
            dispatch({
              type: 'setComponentNodes',
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'add',
                  componentNodes: getState().componentNodes,
                  desc: `add: ${screen.title || screen.name}`,
                },
              ],
            })
          } else if (type === 'change') {
            dispatch({
              type: 'setCurrentScreen',
              payload: [screen],
            })
            dispatch({
              type: 'setActionNode',
              payload: [screen],
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'update',
                  componentNodes: getState().componentNodes,
                  desc: `change: ${screen.title || screen.name}`,
                },
              ],
            })
          } else if (type === 'clear') {
            dispatch({
              type: 'setActionNode',
              payload: [null],
            })
            dispatch({
              type: 'updateComponentNode',
              payload: [
                {
                  type: 'update',
                  node: screen,
                  props: screen.props,
                  addSnapshot: false,
                  children: [],
                },
              ],
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'update',
                  componentNodes: getState().componentNodes,
                  desc: `clear: ${screen.title || screen.name}`,
                },
              ],
            })
          } else if (type === 'delete') {
            const currentScreenIndex = componentNodes.findIndex(
              (item) => item.id === screen.id
            )
            immerComponentNodes.splice(currentScreenIndex, 1)
            const nextScreen =
              componentNodes[currentScreenIndex - 1] ||
              componentNodes[currentScreenIndex + 1]
            dispatch({
              type: 'setActionNode',
              payload: [nextScreen],
            })
            dispatch({
              type: 'setCurrentScreen',
              payload: [nextScreen],
            })
            dispatch({
              type: 'setComponentNodes',
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'delete',
                  componentNodes: getState().componentNodes,
                  desc: `delete: ${screen.title || screen.name}`,
                },
              ],
            })
          }
        }
      },
      updateComponentNode(options: UpdateComponentNodeOptions) {
        return ({ dispatch }) => {
          const { currentScreen, immerComponentNodesMap } = state
          const { addSnapshot = true } = options
          let immerComponentNodes = state.immerComponentNodes
          if (options.type === 'init') {
            const { componentNodes: newComponentNodes } = options
            immerComponentNodes = createDraft(newComponentNodes)
            dispatch({
              type: 'setComponentNodes',
              payload: [immerComponentNodes],
            })
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'init',
                    componentNodes: getState().componentNodes,
                    desc: 'init: init data',
                  },
                ],
              })
          } else if (options.type === 'add') {
            const { newNode, index, parentNode } = options
            const immerParentNode = immerComponentNodesMap[parentNode.id]
            if (isParentComponentRenderNode(immerParentNode)) {
              immerParentNode.children.splice(index, 0, newNode)

              dispatch({
                type: 'setComponentNodes',
                payload: [immerComponentNodes],
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'add',
                      componentNodes: getState().componentNodes,
                      desc: `${currentScreen?.props.title} add: ${
                        newNode.title || newNode.name
                      }`,
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
              dispatch({
                type: 'setComponentNodes',
                payload: [immerComponentNodes],
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'move',
                      componentNodes: getState().componentNodes,
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
            dispatch({
              type: 'setComponentNodes',
              payload: [immerComponentNodes],
            })
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'update',
                    componentNodes: getState().componentNodes,
                    desc: `update: ${node.title || node.name}`,
                  },
                ],
              })
          } else if (options.type === 'delete') {
            const { parentNode, node, index } = options
            const immerParentNode = immerComponentNodesMap[parentNode.id]
            if (isParentComponentRenderNode(immerParentNode)) {
              immerParentNode.children.splice(index, 1)
              dispatch({
                type: 'setComponentNodes',
                payload: [immerComponentNodes],
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'delete',
                      componentNodes: getState().componentNodes,
                      desc: `delete: ${node.title || node.name}`,
                    },
                  ],
                })
            }
          }
        }
      },
    },
    effects: {
      // listen to update the current screen in real time
      componentNodesMap(dispatch, newValue) {
        if (state.currentScreen) {
          if (state.currentScreen !== newValue[state.currentScreen.id].node)
            dispatch({
              type: 'setCurrentScreen',
              payload: [newValue[state.currentScreen.id].node],
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
