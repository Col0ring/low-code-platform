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
      <div
        className={classes}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
        }}
      >
        <EditorMenuArea />
        <EditorSimulatorArea />
        <EditorOperatorArea />
      </div>
      <div
        className="fixed top-0 left-0 -z-1"
        id="editor-drag-image-container"
      />
    </EditorProvider>
  )
}

export default VisualEditor
