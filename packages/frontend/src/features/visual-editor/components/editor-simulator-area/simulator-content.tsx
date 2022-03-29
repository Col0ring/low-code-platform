import React, { useMemo } from 'react'
import BlankContent from '../blank-content'
import { getComponentNode } from '../node-components'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'
import NodeContainer from '../node-container'

const SimulatorContent: React.FC = () => {
  const [{ componentNodes, immerComponentNodes }, { updateComponentNode }] =
    useEditorContext()
  const pageStyle = useMemo(
    () =>
      componentNodes.length === 0
        ? { width: 960, height: 750 }
        : { width: 960, minHeight: 750 },
    [componentNodes.length]
  )
  return (
    <div className="simulator-content-container">
      <DragArea style={pageStyle} className="simulator-content">
        {componentNodes.length === 0 ? (
          <BlankContent
            onDrop={({ name }) => {
              const { component, title } = getComponentNode(name)
              void updateComponentNode(() => {
                immerComponentNodes.push({
                  title,
                  name,
                  props: component.getInitialProps(),
                  id: component.getId(),
                })
              })
            }}
          />
        ) : (
          componentNodes.map((node, index) => {
            return (
              <NodeContainer
                parentNodes={[]}
                key={node.id}
                node={node}
                immerNode={immerComponentNodes[index]}
              />
            )
          })
        )}
      </DragArea>
    </div>
  )
}

export default SimulatorContent
