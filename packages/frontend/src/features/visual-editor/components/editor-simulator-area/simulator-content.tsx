import React from 'react'
import BlankContent from '../blank-content'
import { getComponentNode } from '../node-components'
import { DragArea } from '../dragging'
import { useEditorContext } from '../../provider'

const SimulatorContent: React.FC = () => {
  const [{ componentNodes, immerComponentNodes }, { updateComponentNode }] =
    useEditorContext()
  const pageStyle =
    componentNodes.length === 0
      ? { width: 960, height: 1000 }
      : { width: 960, minHeight: 750 }
  return (
    <div className="simulator-content-container">
      <DragArea style={pageStyle} className="simulator-content">
        {componentNodes.length === 0 ? (
          <BlankContent
            onDrop={({ name }) => {
              const { component, ...rest } = getComponentNode(name)
              void updateComponentNode(() => {
                immerComponentNodes.push({
                  ...rest,
                  props: component.getInitialProps(),
                })
              })
            }}
          />
        ) : (
          componentNodes.map((node, index) => {
            return React.createElement(getComponentNode(node.name).component, {
              // TODO: key uuid
              key: index,
              node,
              immerNode: immerComponentNodes[index],
            })
          })
        )}
      </DragArea>
    </div>
  )
}

export default SimulatorContent
