import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { DragArea } from '../dragging'
import { safeJsonParser } from '@/utils'

export interface BlankContent {
  onDrop?: () => void
}

const BlankContent: React.FC<BlankContent> = () => {
  return (
    <DragArea
      onDrop={(e) => {
        e.dataTransfer.dropEffect = 'move'
        console.log(
          safeJsonParser(e.dataTransfer.getData('component-node'), {})
        )
      }}
      className="w-full h-full flex flex-col text-gray-400 items-center justify-center border-dotted border-gray-600 border"
    >
      <PlusOutlined className="text-gray-500 text-2xl" />
      <span className="mt-2">拖拽组件或区块到这里</span>
    </DragArea>
  )
}

export default BlankContent
