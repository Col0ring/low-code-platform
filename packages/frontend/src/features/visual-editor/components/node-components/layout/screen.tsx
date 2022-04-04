import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface ScreenProps {
  title: string
}

const Screen: NodeComponent<ScreenProps> = ({
  node,
  parentNodes,
  disabled,
}) => {
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
Screen.nodeName = 'screen'
Screen.title = '屏幕'
Screen.getId = () => getId('screen')
Screen.getInitialProps = () => ({
  title: '',
})
Screen.getInitialChildren = () => []

export default Screen
