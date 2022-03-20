export interface ComponentNode {
  children?: ComponentNode[]
  props: any
  type: 'container' | 'display'
  id: number
}
