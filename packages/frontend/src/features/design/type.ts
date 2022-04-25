export interface ComponentNode {
  children?: ComponentNode[]
  props: any
  type: 'container' | 'display'
  id: number
}

export interface Block {
  id: number
  name: string
  content: string
}
