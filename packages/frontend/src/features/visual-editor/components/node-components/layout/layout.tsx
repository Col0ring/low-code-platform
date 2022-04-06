import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'
import { renderNodes } from '..'

const Layout: NodeComponent = ({ node, parentNodes, disabled, editType }) => {
  const { children } = node
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  if (editType === 'prod') {
    return <>{renderNodes(children)}</>
  }
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
Layout.nodeName = 'layout'
Layout.title = '布局'
Layout.getInitialProps = () => ({
  children: [],
})

Layout.getInitialChildren = () => []

Layout.getId = () => getId('layout')

export default Layout
