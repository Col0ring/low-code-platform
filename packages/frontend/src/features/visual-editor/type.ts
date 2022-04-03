import React from 'react'

export interface ComponentNode<T extends object = {}> {
  component: NodeComponent<T>
  hideInMenu?: boolean
  name: string
  icon?: React.ReactNode
  title?: string
}

export interface ComponentRenderNode<T extends object = {}>
  extends Pick<ComponentNode, 'title' | 'name'> {
  props: T
  children?: ComponentRenderNode[]
  id: string
}

export interface ParentComponentRenderNode<T extends object = {}>
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
      componentNodes: ComponentRenderNode[]
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
      props: object
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
  T extends object = {},
  P extends ParentComponentRenderNode[] = ParentComponentRenderNode[]
> {
  // 禁止响应
  disabled?: boolean
  parentNodes: P
  node: ParentComponentRenderNode<T>
}

export type NodeComponent<T extends object = {}> = React.FC<
  NodeComponentProps<T>
> & {
  getInitialProps: () => T
  getId: () => string
  nodeName: string
  title: string
  getInitialChildren?: () => ComponentRenderNode[]
  childActionDisabled?: boolean
}
