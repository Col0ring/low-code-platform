import React, { useState } from 'react'
import { Breadcrumb, Tabs } from 'antd'

const operators = ['属性', '样式', '高级']
const contents = ['属性', '样式', '高级']
const EditorOperatorArea: React.FC = () => {
  const [active, setActive] = useState('0')

  return (
    <div className="editor-operator-area">
      <Tabs
        size="small"
        centered
        activeKey={active}
        onChange={setActive}
        moreIcon={null}
      >
        {operators.map((operator, index) => (
          <Tabs.TabPane tab={operator} key={index} />
        ))}
      </Tabs>
      <div className="operator-breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>App Name</Breadcrumb.Item>
          <Breadcrumb.Item>Page Name</Breadcrumb.Item>
          <Breadcrumb.Item>Page Name</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="operator-content">{contents[+active]}</div>
    </div>
  )
}

export default EditorOperatorArea
