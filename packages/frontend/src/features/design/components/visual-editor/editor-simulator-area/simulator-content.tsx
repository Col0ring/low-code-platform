import React from 'react'
import BlankContent from './blank-content'
import { ComponentNode } from '../../../type'
import { DragArea } from '../dragging'

export interface SimulatorContentProps {
  componentNodes: ComponentNode[]
}

function renderComponentNodes(nodes: ComponentNode[]) {
  return nodes.map((node, index) => {
    if (node.type === 'container') {
      return (
        // TODO: 设置节点插入
        <DragArea>
          {node.children ? (
            renderComponentNodes(node.children)
          ) : (
            <BlankContent />
          )}
        </DragArea>
      )
    } else if (node.type === 'display') {
      return node.id
    }
  })
}
const SimulatorContent: React.FC<SimulatorContentProps> = ({
  componentNodes,
}) => {
  return (
    <div className="simulator-content-container">
      <div
        style={{
          width: 960,
          height: 750,
        }}
        className="simulator-content"
      >
        <BlankContent />
      </div>
    </div>
  )
}

export default SimulatorContent
