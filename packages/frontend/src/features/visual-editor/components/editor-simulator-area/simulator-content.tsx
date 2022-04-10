import React from 'react'
import { useEditorContext } from '../../provider'
import EditorPreview from '../editor-preview'

const SimulatorContent: React.FC = () => {
  const [{ page }] = useEditorContext()
  return (
    <div className="inline-flex justify-center min-w-full">
      <div className="simulator-content-container">
        <div className="simulator-content">
          <EditorPreview editType="edit" page={page} />
        </div>
      </div>
    </div>
  )
}

export default SimulatorContent
