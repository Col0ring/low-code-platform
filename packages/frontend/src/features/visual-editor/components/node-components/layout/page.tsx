import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface PageProps {
  children: ComponentRenderNode[]
}

const Page: NodeComponent<PageProps> = ({
  node,
  immerNode,
  parentNodes,
  disabled,
}) => {
  const {
    props: { children },
  } = node
  const pageStyle = useMemo(
    () =>
      children.length === 0
        ? { width: 300, height: 750 }
        : { width: 300, minHeight: 750 },
    [children.length]
  )
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  return (
    <div style={pageStyle}>
      {children.length === 0 ? (
        <BlankContent immerNode={immerNode} disabled={disabled} />
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

Page.getInitialProps = () => ({
  children: [],
})

Page.getId = () => getId('page')

export default Page
