import React from 'react'
import { PlusOutlined } from '@ant-design/icons'

const EmptyContent: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col text-gray-400 items-center justify-center border-dotted border-gray-600 border">
      <PlusOutlined className="text-gray-500 text-2xl" />
      <span className="mt-2">拖拽组件或区块到这里</span>
    </div>
  )
}

export default EmptyContent
