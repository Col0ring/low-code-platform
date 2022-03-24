import React from 'react'
import VisualEditor from '@/features/visual-editor'
import './style.less'

const DesignIndexPage: React.FC = () => {
  return (
    <div className="design-index-page">
      <VisualEditor className="h-full" />
    </div>
  )
}

export default DesignIndexPage
