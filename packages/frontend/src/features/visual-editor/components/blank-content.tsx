import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import { DragArea } from './dragging'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '../constants'
import { DragData } from '../type'

export interface BlankContent {
  onDrop: (data: DragData, e: React.DragEvent) => void
}

const BlankContent: React.FC<BlankContent> = ({ onDrop }) => {
  const [isHovering, setIsHovering] = useState(false)
  const classes = useMemo(
    () =>
      classnames(
        'p-3 h-full flex flex-col text-gray-400 items-center justify-center border-dashed border-1 border-gray-600 border m-1',
        isHovering ? 'bg-blue-100' : 'bg-gray-100'
      ),
    [isHovering]
  )
  return (
    <DragArea
      onChange={setIsHovering}
      onDrop={(e) => {
        e.dataTransfer.dropEffect = 'move'
        const componentNode = safeJsonParser<DragData>(
          e.dataTransfer.getData(DraggingData.ComponentNode),
          {
            name: '',
          }
        )
        componentNode.name && onDrop(componentNode, e)
      }}
      className={classes}
    >
      <PlusOutlined className="text-gray-500 text-2xl" />
      <span className="mt-2">拖拽组件或区块到这里</span>
    </DragArea>
  )
}

export default BlankContent
