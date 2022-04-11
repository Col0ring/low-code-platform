import React from 'react'
import { ScreenProps } from './components/node-components/layout/screen'

export interface Action {
  actionType: 'js' | 'internal'
  actionEvent: string
  value: Record<string, any>
}

export type Actions<T extends string = string> = Record<T, Action[]>

export interface ComponentNode<T extends object = any> {
  component: NodeComponent<T>
  hideInMenu?: boolean
  name: string
  icon?: React.ReactNode
  title?: string
}

export interface ComponentRenderNode<T extends object = any>
  extends Pick<ComponentNode, 'title' | 'name'> {
  props: T
  actions?: Actions
  style: React.CSSProperties
  children?: ComponentRenderNode[]
  id: string
}

export interface PageRenderNode extends ComponentRenderNode {
  children: ComponentRenderNode<ScreenProps>[]
  js: string
  modals: string[]
}

export interface ParentComponentRenderNode<T extends object = any>
  extends ComponentRenderNode<T> {
  children: ComponentRenderNode[]
}

export interface ComponentsGroup {
  group: string
  components: ComponentNode<any>[]
}

export type DragData =
  | {
      type: 'add'
      name: string
    }
  | {
      type: 'move'
      index: number
    }

export type UpdateComponentNodeOptions = {
  addSnapshot?: boolean
} & (
  | {
      type: 'init'
      page: PageRenderNode
    }
  | {
      type: 'add'
      newNode: ComponentRenderNode
      index: number
      parentNode: ParentComponentRenderNode
    }
  | {
      type: 'move'
      moveNode: ComponentRenderNode
      moveNodeIndex: number
      moveParentNode: ParentComponentRenderNode
      parentNode: ParentComponentRenderNode
      nodeIndex: number
    }
  | {
      type: 'update'
      node: ComponentRenderNode
      style?: React.CSSProperties
      props?: object
      actions?: Actions
      children?: ComponentRenderNode[]
    }
  | {
      type: 'delete'
      parentNode: ParentComponentRenderNode
      node: ComponentRenderNode
      index: number
    }
)

export interface NodeComponentProps<
  T extends object = any,
  P extends ParentComponentRenderNode[] = ParentComponentRenderNode[]
> {
  // 禁止响应
  disabled?: boolean
  parentNodes: P
  editType?: 'prod' | 'edit'
  node: ParentComponentRenderNode<T>
}

export type NodeComponent<T extends object = {}> = React.FC<
  NodeComponentProps<T>
> & {
  PropsForm?: React.ComponentType<{ node: ParentComponentRenderNode<T> }>
  getInitialProps: () => T
  getId: () => string
  nodeName: string
  title: string
  getInitialChildren?: () => ComponentRenderNode[]
  childActionDisabled?: boolean
  getInitialStyle?: () => React.CSSProperties
}
