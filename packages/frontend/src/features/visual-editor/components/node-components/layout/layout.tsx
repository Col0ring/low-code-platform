import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface LayoutProps {
  children: ComponentRenderNode[]
}

const Layout: NodeComponent<LayoutProps> = ({
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
              index={index}
              key={child.id}
              node={child}
              immerParentNode={immerNode}
              parentNodes={childParentNodes}
              immerNode={immerNode.props.children[index]}
            />
          )
        })
      )}
    </div>
  )
}

Layout.getInitialProps = () => ({
  children: [],
})

Layout.getId = () => getId('layout')

export default Layout
