import React, { useMemo } from 'react'
import { Input, Form, Collapse, Button, Dropdown, Menu } from 'antd'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'
import { propItemName, renderNodes } from '..'
import ActionModal from '../../action-modal'

export interface ScreenProps {
  title: string
  maxWidth: number | 'max'
  minWidth: number
}

const Screen: NodeComponent<ScreenProps> = ({
  node,
  parentNodes,
  disabled,
  editType,
}) => {
  const { children, style } = node

  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  if (editType === 'prod') {
    return <>{renderNodes(children)}</>
  }
  return (
    <div style={style}>
      {children.length === 0 ? (
        <div
          className="flex flex-col"
          style={{
            height: style.height,
            minHeight: style.minHeight,
          }}
        >
          <BlankContent node={node} disabled={disabled} />
        </div>
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              disabled={disabled}
              index={index}
              key={child.id}
              node={child}
              parentNodes={childParentNodes}
            />
          )
        })
      )}
    </div>
  )
}

const ScreenPropsForm: typeof Screen['PropsForm'] = ({ node }) => {
  const { props } = node
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性设置" key="props">
        <Form.Item name={propItemName('title')} label="屏幕名称">
          <Input />
        </Form.Item>
        <Form.Item name={propItemName('maxWidth')} label="最大宽度">
          <Input />
        </Form.Item>
        <Form.Item name={propItemName('minWidth')} label="最小宽度">
          <Input />
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Dropdown
          placement="bottom"
          overlay={
            <Menu>
              <Menu.Item key="click">
                <ActionModal modalProps={{ title: '当点击时' }}>
                  当点击时
                </ActionModal>
              </Menu.Item>
            </Menu>
          }
        >
          <Button className="mt-3" type="primary" size="middle" block>
            新建动作
          </Button>
        </Dropdown>
      </Collapse.Panel>
    </Collapse>
  )
}
Screen.PropsForm = ScreenPropsForm
Screen.nodeName = 'screen'
Screen.title = '屏幕'
Screen.getId = () => getId('screen')
Screen.getInitialProps = () => ({
  title: '',
  maxWidth: 'max',
  minWidth: 0,
})
Screen.getInitialChildren = () => []

Screen.getInitialStyle = () => ({
  width: 375,
  height: 'auto',
  minWidth: 0,
  minHeight: 750,
})

export default Screen
