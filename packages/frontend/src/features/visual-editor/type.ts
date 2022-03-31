import React from 'react'
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
  id: string
}

export interface ComponentsGroup {
  group: string
  components: ComponentNode[]
}

export type DragData =
  | {
      name: string
      type: 'add'
    }
  | {
      type: 'move'
      index: number
    }

export interface BaseLayoutProps {
  children: ComponentRenderNode[]
}
export interface NodeComponentProps<
  T extends object = any,
  P extends ComponentRenderNode<BaseLayoutProps>[] = ComponentRenderNode<BaseLayoutProps>[]
> {
  disabled?: boolean
  parentNodes: P
  node: ComponentRenderNode<T>
  immerNode: ComponentRenderNode<T>
}

export type NodeComponent<T extends object = any> = React.FC<
  NodeComponentProps<T>
> & {
  getInitialProps: () => T
  getId: () => string
}
