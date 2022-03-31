import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface ContainerProps {
  children: ComponentRenderNode[]
}

const Container: NodeComponent<ContainerProps> = ({
  node,
  immerNode,
  parentNodes,
  disabled,
}) => {
  const {
    props: { children },
  } = node

  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  return (
    <div>
      {children.length === 0 ? (
        <BlankContent disabled={disabled} immerNode={immerNode} />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              disabled={disabled}
              immerParentNode={immerNode}
              index={index}
              key={child.id}
              node={child}
              parentNodes={childParentNodes}
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
