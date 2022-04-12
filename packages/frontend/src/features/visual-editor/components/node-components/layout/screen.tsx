import React, { useMemo } from 'react'
import { Input, Form, Collapse } from 'antd'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'
import { parserActions, propItemName, renderNodes } from '..'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'

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
  const { children, actions: actionsProp, style } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  if (editType === 'prod') {
    return <>{renderNodes(children)}</>
  }
  return (
    <div className="node-screen" style={style} {...events}>
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

const ScreenPropsForm: typeof Screen['PropsForm'] = () => {
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
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击按钮' }]} />
        </Form.Item>
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
  minWidth: 375,
  minHeight: 650,
})

export default Screen
