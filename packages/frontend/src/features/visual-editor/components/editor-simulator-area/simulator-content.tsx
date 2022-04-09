import React from 'react'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'
import NodeContainer from '../node-container'

const SimulatorContent: React.FC = () => {
  const [{ currentScreen, componentNodes }] = useEditorContext()
  return (
    <div className="inline-flex justify-center min-w-full">
      <div className="simulator-content-container">
        <DragArea className="simulator-content">
          {componentNodes.map((node, index) => {
            return currentScreen?.id === node.id ? (
              <NodeContainer
                index={index}
                parentNodes={[]}
                key={node.id}
                node={node}
              />
            ) : null
          })}
        </DragArea>
      </div>
    </div>
  )
}

export default SimulatorContent
