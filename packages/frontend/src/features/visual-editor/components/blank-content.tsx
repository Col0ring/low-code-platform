import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import { DragArea } from './dragging'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '../constants'
import { DragData, ParentComponentRenderNode } from '../type'
import { copyNode, createNewNode } from './node-components'
import { useEditorContext } from '../provider'

export interface BlankContent {
  node: ParentComponentRenderNode
  disabled?: boolean
}

const BlankContent: React.FC<BlankContent> = ({ node, disabled }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [
    { isDragging, moveNode, moveParentNode },
    { updateComponentNode, finishDragging },
  ] = useEditorContext()
  const classes = useMemo(
    () =>
      classnames(
        'p-3 h-full flex flex-col text-gray-400 items-center justify-center border-dashed border-1 border-gray-600 border flex-1',
        disabled
          ? 'bg-gray-300'
          : isHovering && isDragging
          ? 'bg-blue-100'
          : 'bg-gray-100'
      ),
    [disabled, isHovering, isDragging]
  )

  return (
    <div className="p-1 h-full relative flex-1 flex flex-col">
      <DragArea
        onChange={setIsHovering}
        onDrop={(e) => {
          if (disabled) {
            return
          }
          e.dataTransfer.dropEffect = 'move'
          const dragData = safeJsonParser<DragData>(
            e.dataTransfer.getData(DraggingData.ComponentNode),
            {
              type: '',
            } as unknown as DragData
          )
          if (dragData.type) {
            if (dragData.type === 'add') {
              const newNode = createNewNode(dragData.name)
              finishDragging({ actionNode: newNode })
              updateComponentNode({
                type: 'add',
                parentNode: node,
                index: node.children.length,
                newNode,
              })
            } else if (dragData.type == 'move' && moveNode && moveParentNode) {
              finishDragging({ actionNode: moveNode })
              updateComponentNode({
                type: 'move',
                moveNode,
                moveParentNode,
                moveNodeIndex: dragData.index,
                parentNode: node,
                nodeIndex: node.children.length,
              })
            } else if (dragData.type === 'add-block') {
              const newNode = copyNode(dragData.node)
              finishDragging({ actionNode: newNode })
              updateComponentNode({
                type: 'add',
                parentNode: node,
                index: node.children.length,
                newNode,
              })
            }
          }
        }}
        className={classes}
      >
        <PlusOutlined className="text-gray-500 text-2xl" />
        <span className="mt-2">拖拽组件或区块到这里</span>
      </DragArea>
    </div>
  )
}

export default BlankContent
