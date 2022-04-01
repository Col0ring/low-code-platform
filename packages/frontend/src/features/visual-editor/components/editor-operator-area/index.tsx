import React, { useState } from 'react'
import { Breadcrumb, Tabs } from 'antd'
import { useEditorContext } from '../../provider'
import OutlineTreePane from '../editor-menu-area/panes/outline-tree-pane'

const operators = ['属性', '样式', '高级']
const contents = ['属性', '样式', '高级']
const EditorOperatorArea: React.FC = () => {
  const [active, setActive] = useState('0')
  const [{ isDragging }] = useEditorContext()
  return (
    <div className="editor-operator-area">
      {isDragging ? (
        <OutlineTreePane />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default EditorOperatorArea
