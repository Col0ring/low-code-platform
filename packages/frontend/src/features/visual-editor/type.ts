export interface ComponentNode<T extends object = any> {
  children?: ComponentNode[]
  props: T
  component: React.ElementType<ComponentNodeProps>
  name: string
  icon?: React.ReactNode
  title?: string
}

export interface ComponentsGroup {
  group: string
  components: ComponentNode[]
}

export interface DragData {
  name: string
  children?: DragData[]
}

export interface ComponentNodeProps<T extends object = any> {
  node: ComponentNode<T>
}
