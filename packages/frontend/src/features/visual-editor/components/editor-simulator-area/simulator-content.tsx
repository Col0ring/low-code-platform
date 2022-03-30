import React, { useMemo } from 'react'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'
import NodeContainer from '../node-container'

const SimulatorContent: React.FC = () => {
  const [{ componentNodes, immerComponentNodes }] = useEditorContext()
  return (
    <div className="simulator-content-container">
      <DragArea className="simulator-content">
        {componentNodes.map((node, index) => {
          return (
            <NodeContainer
              parentNodes={[]}
              key={node.id}
              node={node}
              immerNode={immerComponentNodes[index]}
            />
          )
        })}
      </DragArea>
    </div>
  )
}

export default SimulatorContent
