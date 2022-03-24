import React from 'react'
import BlankContent from '../blank-content'
import { ComponentNode } from '../../type'
import { componentsMap } from '../node-components'
import { DragArea } from '../dragging'

export interface SimulatorContentProps {
  componentNodes: ComponentNode[]
}

const SimulatorContent: React.FC<SimulatorContentProps> = ({
  componentNodes,
}) => {
  const pageStyle =
    componentNodes.length === 0
      ? { width: 960, height: 750 }
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
            return React.createElement(componentsMap[node.name].component, {
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
