import React from 'react'
import { StrictOmit } from 'types-kit'
export interface ComponentNode<T extends object = any> {
  component: NodeComponent<T>
  name: string
  icon?: React.ReactNode
  title?: string
}

export interface ComponentRenderNode<T extends object = any>
  extends StrictOmit<ComponentNode, 'component'> {
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
  immerNode: ComponentRenderNode<T>
}

export type NodeComponent<T extends object = any> = React.FC<
  NodeComponentProps<T>
> & {
  getInitialProps: () => T
}
