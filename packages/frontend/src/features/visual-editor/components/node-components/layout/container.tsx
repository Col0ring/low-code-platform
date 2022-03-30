import React from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { useEditorContext } from '../../../provider'
import { getComponentNode } from '..'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface ContainerProps {
  children: ComponentRenderNode[]
}

const Container: NodeComponent<ContainerProps> = ({
  node,
  immerNode,
  parentNodes,
}) => {
  const [, { updateComponentNode, setEditorState }] = useEditorContext()
  const {
    props: { children },
  } = node
  return (
    <div>
      {children.length === 0 ? (
        <BlankContent
          onDrop={({ name }) => {
            const { component, title } = getComponentNode(name)
            void updateComponentNode(() => {
              const newNode = {
                title,
                name,
                id: component.getId(),
                props: component.getInitialProps(),
              }
              immerNode.props.children.push(newNode)
              setEditorState({
                actionNode: newNode,
              })
            })
          }}
        />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              key={child.id}
              node={child}
              parentNodes={parentNodes}
              immerNode={immerNode.props.children[index]}
            />
          )
        })
      )}
    </div>
  )
}

Container.getInitialProps = () => ({
  children: [],
})

Container.getId = () => getId('container')

export default Container
