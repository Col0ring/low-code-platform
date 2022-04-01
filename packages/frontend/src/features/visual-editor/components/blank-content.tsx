import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import { DragArea } from './dragging'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '../constants'
import { BaseLayoutProps, ComponentRenderNode, DragData } from '../type'
import { createNewNode } from './node-components'
import { useEditorContext } from '../provider'

export interface BlankContent {
  immerNode: ComponentRenderNode<BaseLayoutProps>
  disabled?: boolean
}

const BlankContent: React.FC<BlankContent> = ({ immerNode, disabled }) => {
  const [isHovering, setIsHovering] = useState(false)
  const classes = useMemo(
    () =>
      classnames(
        'p-3 h-full flex flex-col text-gray-400 items-center justify-center border-dashed border-1 border-gray-600 border',
        disabled ? 'bg-gray-300' : isHovering ? 'bg-blue-100' : 'bg-gray-100'
      ),
    [disabled, isHovering]
  )
  const [
    { moveNode, immerMoveParentNode },
    { updateComponentNode, setEditorState },
  ] = useEditorContext()

  return (
    <div className="p-1 h-full relative">
      <DragArea
        onChange={setIsHovering}
        onDrop={(e) => {
          if (disabled) {
            return
          }
          e.dataTransfer.dropEffect = 'move'
          const componentNode = safeJsonParser<DragData>(
            e.dataTransfer.getData(DraggingData.ComponentNode),
            {
              type: '',
            } as unknown as DragData
          )
          if (componentNode.type) {
            void updateComponentNode(() => {
              if (componentNode.type === 'add') {
                const newNode = createNewNode(componentNode.name)
                immerNode.props.children.push(newNode)
                setEditorState({
                  actionNode: newNode,
                })
              } else if (
                componentNode.type === 'move' &&
                immerMoveParentNode &&
                moveNode
              ) {
                immerNode.props.children.push(moveNode)
                immerMoveParentNode.props.children.splice(
                  componentNode.index,
                  1
                )
                setEditorState({
                  immerMoveParentNode: null,
                  hoveringNode: null,
                  actionNode: moveNode,
                })
              }
            })
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
