import React, { useEffect } from 'react'
import VisualEditor, { VisualEditorActions } from '@/features/visual-editor'
import './style.less'

const DesignIndexPage: React.FC = () => {
  const actions = React.useRef<VisualEditorActions>(null)
  useEffect(() => {
    if (actions.current) {
      actions.current.init()
    }
  }, [])
  return (
    <div className="design-index-page">
      <VisualEditor className="h-full" actions={actions} />
    </div>
  )
}

export default DesignIndexPage
