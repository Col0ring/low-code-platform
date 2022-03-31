import React from 'react'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'
import NodeContainer from '../node-container'

const SimulatorContent: React.FC = () => {
  const [{ componentNodes, immerComponentNodes }] = useEditorContext()
  return (
    <div className="inline-flex justify-center min-w-full">
      <div className="simulator-content-container">
        <DragArea className="simulator-content">
          {componentNodes.map((node, index) => {
            return (
              <NodeContainer
                index={index}
                immerParentNode={null}
                parentNodes={[]}
                key={node.id}
                node={node}
                immerNode={immerComponentNodes[index]}
              />
            )
          })}
        </DragArea>
      </div>
    </div>
  )
}

export default SimulatorContent
