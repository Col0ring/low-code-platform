import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { DragArea } from './dragging'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '@/features/design/constants'
import { DragData } from '../type'

export interface BlankContent {
  onDrop: (data: DragData, e: React.DragEvent) => void
}

const BlankContent: React.FC<BlankContent> = ({ onDrop }) => {
  return (
    <DragArea
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
      className="w-full h-full flex flex-col text-gray-400 items-center justify-center border-dotted border-gray-600 border bg-gray-100"
    >
      <PlusOutlined className="text-gray-500 text-2xl" />
      <span className="mt-2">拖拽组件或区块到这里</span>
    </DragArea>
  )
}

export default BlankContent
