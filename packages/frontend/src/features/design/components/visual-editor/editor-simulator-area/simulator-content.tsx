import React from 'react'
import EmptyContent from './empty-content'

const SimulatorContent: React.FC = () => {
  return (
    <div className="simulator-content-container">
      <div
        style={{
          width: 960,
          height: 750,
        }}
        className="simulator-content"
      >
        <EmptyContent />
      </div>
    </div>
  )
}

export default SimulatorContent
