import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

const Container: NodeComponent = ({ node, parentNodes, disabled }) => {
  const { children } = node

  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  return (
    <div>
      {children.length === 0 ? (
        <BlankContent disabled={disabled} node={node} />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              disabled={disabled}
              index={index}
              key={child.id}
              node={child}
              parentNodes={childParentNodes}
            />
          )
        })
      )}
    </div>
  )
}

Container.nodeName = 'container'
Container.title = '容器'
Container.getInitialProps = () => ({})
Container.getInitialChildren = () => []
Container.getId = () => getId('container')

export default Container
