import React, { useState, useMemo } from 'react'
import { Breadcrumb, Button, message, Space, Tabs } from 'antd'
import { useEditorContext } from '../../provider'
import { getComponentNode } from '../node-components'

const operators = ['属性', '样式', '高级']
const contents = ['属性', '样式', '高级']
const EditorOperatorArea: React.FC = () => {
  const [active, setActive] = useState('0')
  const [{ actionNode, componentNodesMap }, { setActionNode }] =
    useEditorContext()
  const renderParentNodes = useMemo(
    () =>
      actionNode ? componentNodesMap[actionNode.id].parentNodes.slice(-2) : [],
    [actionNode, componentNodesMap]
  )
  return (
    <div className="editor-operator-area">
      {actionNode ? (
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
              {renderParentNodes.map((parentNode) => (
                <Breadcrumb.Item
                  className="cursor-pointer text-dark-400"
                  key={parentNode.id}
                  onClick={() => {
                    setActionNode(parentNode)
                  }}
                >
                  <Space size="small">
                    {getComponentNode(parentNode.name).icon}
                    {parentNode.title || parentNode.name}
                  </Space>
                </Breadcrumb.Item>
              ))}
              <Breadcrumb.Item key={actionNode.id} className="text-gray-400">
                <Space size="small">
                  {getComponentNode(actionNode.name).icon}
                  {actionNode.title || actionNode.name}
                </Space>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="operator-content">{contents[+active]}</div>
          <div className="absolute left-0 bottom-0 h-12 border border-t-gray-200 w-full p-2 flex justify-end">
            <Button
              type="primary"
              onClick={() => {
                void message.success('应用成功')
              }}
            >
              应用
            </Button>
            <Button
              className="ml-3"
              onClick={() => {
                void message.success('取消操作')
              }}
            >
              取消
            </Button>
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center pt-14">
          请在左侧画布选中节点
        </div>
      )}
    </div>
  )
}

export default EditorOperatorArea
