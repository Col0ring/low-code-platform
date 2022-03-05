import React from 'react'
import SimulatorContent from './simulator-content'
import SimulatorToolbar from './simulator-toolbar'

const EditorSimulatorArea: React.FC = () => {
  return (
    <div className="editor-simulator-area">
      <SimulatorToolbar />
      <SimulatorContent />
    </div>
  )
}

export default EditorSimulatorArea
