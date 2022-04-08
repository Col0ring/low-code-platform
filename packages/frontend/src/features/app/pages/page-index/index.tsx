import React from 'react'
import { Empty } from 'antd'

const PageIndexPage: React.FC = () => {
  return (
    <Empty
      className="h-full flex-col flex items-center justify-center"
      description={<span className="text-gray-400">请点击左边页面</span>}
    />
  )
}

export default PageIndexPage
