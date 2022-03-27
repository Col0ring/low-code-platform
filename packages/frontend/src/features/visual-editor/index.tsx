import React from 'react'
import classnames from 'classnames'
import EditorMenuArea from './components/editor-menu-area'
import EditorOperatorArea from './components/editor-operator-area'
import EditorSimulatorArea from './components/editor-simulator-area'
import './style.less'
import { EditorProvider } from './provider'
export interface VisualEditorProps {
  className?: string
}
const VisualEditor: React.FC<VisualEditorProps> = (props) => {
  const { className } = props
  const classes = classnames(className, 'visual-editor')
  return (
    <EditorProvider>
      <div className={classes}>
        <EditorMenuArea />
        <EditorSimulatorArea />
        <EditorOperatorArea />
      </div>
    </EditorProvider>
  )
}

export default VisualEditor
