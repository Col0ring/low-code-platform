import { createMethodsContext } from 'react-use-methods'
import type { ArrayItem, StrictOmit } from 'types-kit'
import { createDraft, Draft, finishDraft, isDraft } from 'immer'
import {
  PageRenderNode,
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
  page: PageRenderNode
  currentScreen: ComponentRenderNode | null
  disabledNodeAction: boolean
  componentNodesMap: Record<
    string,
    {
      node: ComponentRenderNode
      parentNodes: ParentComponentRenderNode[]
    }
  >
  immerPage: Draft<PageRenderNode>
  immerComponentNodesMap: Record<string, Draft<ComponentRenderNode>>
  snapshots: {
    type: UpdateComponentNodeOptions['type']
    desc: string
    timestamp: number
    actionNode: ComponentRenderNode | null
    currentScreen: ComponentRenderNode | null
    page: PageRenderNode
  }[]
  snapshotIndex: number
  isDragging: boolean
  moveNode: ComponentRenderNode | null
  moveParentNode: ParentComponentRenderNode | null
  actionNode: ComponentRenderNode | null
  hoveringNode: ComponentRenderNode | null
}

function getComponentNodeMap(
  componentNodes: PageRenderNode | ComponentRenderNode[],
  parentNodes: ParentComponentRenderNode[] = []
): EditorState['componentNodesMap'] {
  const componentNodesMap: EditorState['componentNodesMap'] = {}
  const isArray = Array.isArray(componentNodes)
  ;(isArray ? componentNodes : [componentNodes]).forEach((node) => {
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
  immerComponentNodes: PageRenderNode | Draft<ComponentRenderNode[]>
): EditorState['immerComponentNodesMap'] {
  const immerComponentNodesMap: EditorState['immerComponentNodesMap'] = {}
  ;(Array.isArray(immerComponentNodes)
    ? immerComponentNodes
    : [immerComponentNodes]
  ).forEach((node) => {
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

const initialState: () => EditorState = () => {
  const page: PageRenderNode = {
    ...createNewNode(Page.nodeName),
    children: [],
    js: '',
    dataSources: {},
    modals: [],
  }
  const immerPage = createDraft(page)
  return {
    menuSelectedKeys: [],
    disabledNodeAction: false,
    page,
    currentScreen: null,
    immerPage,
    immerComponentNodesMap: getImmerComponentNodeMap(immerPage),
    componentNodesMap: getComponentNodeMap(page),
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
        page,
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
                    page,
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
                    page,
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
        const { page, currentScreen, actionNode } =
          state.snapshots[snapshotIndex]
        const changedState: EditorState = this.setPage(page)
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
      setPage(pageOrImmerPage?: PageRenderNode | Draft<PageRenderNode>) {
        const newPage = isDraft(pageOrImmerPage || state.immerPage)
          ? finishDraft(pageOrImmerPage || state.immerPage)
          : (pageOrImmerPage as PageRenderNode)
        const newImmerPage = createDraft(newPage)
        const newComponentNodesMap = getComponentNodeMap(newPage)
        const newImmerComponentNodesMap = getImmerComponentNodeMap(newImmerPage)
        return {
          ...state,
          page: newPage,
          immerPage: newImmerPage,
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
          const { page, immerPage } = state
          const componentNodes = page.children
          const immerComponentNodes = immerPage.children
          if (type === 'add') {
            immerComponentNodes.push(screen)
            dispatch({
              type: 'setCurrentScreen',
              payload: [screen],
            })
            dispatch({
              type: 'setPage',
            })
            dispatch({
              type: 'setActionNode',
              payload: [screen],
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'add',
                  page: getState().page,
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
                  page: getState().page,
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
                  page: getState().page,
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
              type: 'setPage',
            })
            dispatch({
              type: 'addSnapshot',
              payload: [
                {
                  type: 'delete',
                  page: getState().page,
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
          if (options.type === 'init') {
            const { page } = options
            dispatch({
              type: 'setPage',
              payload: [page],
            })
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'init',
                    page: getState().page,
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
                type: 'setPage',
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'add',
                      page: getState().page,
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
                type: 'setPage',
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'move',
                      page: getState().page,
                      desc: `move: ${
                        moveParentNode.title || moveParentNode.name
                      } > ${moveNode.title || moveNode.name} => ${
                        parentNode.title || parentNode.name
                      } > ${moveNode.title || moveNode.name}`,
                    },
                  ],
                })
            }
            // if type is update
          } else if (options.type === 'update') {
            const { node, props, actions, style, children, advanced } = options
            const immerNode = immerComponentNodesMap[node.id]
            if (props) {
              immerNode.props = props
            }
            if (style) {
              immerNode.style = style
            }
            if (actions) {
              immerNode.actions = actions
            }
            if (advanced) {
              immerNode.advanced = advanced
            }
            if (children && isParentComponentRenderNode(immerNode)) {
              immerNode.children = children
            }
            dispatch({
              type: 'setPage',
            })
            dispatch({
              type: 'setActionNode',
              payload: [getState().componentNodesMap[node.id].node],
            })
            addSnapshot &&
              dispatch({
                type: 'addSnapshot',
                payload: [
                  {
                    type: 'update',
                    page: getState().page,
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
                type: 'setPage',
              })
              addSnapshot &&
                dispatch({
                  type: 'addSnapshot',
                  payload: [
                    {
                      type: 'delete',
                      page: getState().page,
                      desc: `delete: ${node.title || node.name}`,
                    },
                  ],
                })
            }
          }
        }
      },
      updatePageData(
        options: Partial<Pick<PageRenderNode, 'js' | 'dataSources' | 'modals'>>
      ) {
        return ({ dispatch }) => {
          const { immerPage } = state
          for (const key in options) {
            if (options[key as keyof typeof options]) {
              ;(immerPage as Record<string, any>)[key] =
                options[key as keyof typeof options]
            }
          }
          dispatch({
            type: 'setPage',
          })
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
