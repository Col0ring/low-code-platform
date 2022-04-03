import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

const Page: NodeComponent = ({ node, parentNodes, disabled }) => {
  const { children } = node
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
        <BlankContent node={node} disabled={disabled} />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              disabled={disabled}
              draggable
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
Page.nodeName = 'page'
Page.title = '页面'
Page.getId = () => getId('page')
Page.getInitialProps = () => ({})
Page.getInitialChildren = () => []

export default Page
