import React from 'react'
import BlankContent from '../blank-content'
import { ComponentRenderNode } from '../../type'
import { getComponentNode } from '../node-components'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'

export interface SimulatorContentProps {
  componentNodes: ComponentRenderNode[]
}

const SimulatorContent: React.FC<SimulatorContentProps> = ({
  componentNodes,
}) => {
  console.log(useEditorContext())
  const pageStyle =
    componentNodes.length === 0
      ? { width: 960, height: 1000 }
      : { width: 960, minHeight: 750 }
  return (
    <div className="simulator-content-container">
      <DragArea style={pageStyle} className="simulator-content">
        {componentNodes.length === 0 ? (
          <BlankContent
            onDrop={(data) => {
              console.log(data)
            }}
          />
        ) : (
          componentNodes.map((node, index) => {
            return React.createElement(getComponentNode(node.name).component, {
              // TODO: key uuid
              key: index,
              node,
            })
          })
        )}
      </DragArea>
    </div>
  )
}

export default SimulatorContent
