import React from 'react'
import { Tabs } from 'antd'

const operators = ['属性', '样式', '高级']
const EditorOperatorArea: React.FC = () => {
  return (
    <div className="editor-operator-area">
      <Tabs size="small" centered>
        {operators.map((operator, index) => (
          <Tabs.TabPane tab={operator} key={index} />
        ))}
      </Tabs>
    </div>
  )
}

export default EditorOperatorArea
