import React from 'react'
export interface ComponentNode<T extends object = any> {
  component: NodeComponent<T>
  name: string
  icon?: React.ReactNode
  title?: string
}

export interface ComponentRenderNode<T extends object = any>
  extends Omit<ComponentNode<T>, 'getInitialProps'> {
  props: T
}

export interface ComponentsGroup {
  group: string
  components: ComponentNode[]
}

export interface DragData {
  name: string
}

export interface NodeComponentProps<T extends object = any> {
  node: ComponentRenderNode<T>
}

export type NodeComponent<T extends object = any> = React.FC<
  NodeComponentProps<T>
> & {
  getInitialProps: () => T
}
