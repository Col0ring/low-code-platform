import React from 'react'
import classnames from 'classnames'
import EditorMenuArea from './editor-menu-area'
import EditorOperatorArea from './editor-operator-area'
import './style.less'
export interface VisualEditorProps {
  className?: string
}
const VisualEditor: React.FC<VisualEditorProps> = (props) => {
  const { className } = props
  const classes = classnames(className, 'visual-editor')
  return (
    <div className={classes}>
      <EditorMenuArea />
      <div className="editor-simulator-area">center</div>
      <EditorOperatorArea />
    </div>
  )
}

export default VisualEditor
