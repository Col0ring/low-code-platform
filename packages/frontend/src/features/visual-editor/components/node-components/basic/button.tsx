import React, { useMemo } from 'react'
import {
  Button as AntdButton,
  Collapse,
  Form,
  Input,
  Select,
  Switch,
} from 'antd'
import { Actions, NodeComponent } from '@/features/visual-editor/type'
import { getId } from '@/utils'
import { parserActions, propItemName } from '..'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import AddAction from '../../add-action/inidex'

const buttonTypes = ['primary', 'default', 'dashed', 'link', 'text'] as const

export interface ButtonProps {
  type?: typeof buttonTypes[number]
  content?: string
  actions?: Actions<'onClick'>
}

const Button: NodeComponent<ButtonProps> = ({ node }) => {
  const { props, actions: actionsProp, style } = node
  const { content, ...antdProps } = props
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions),
    [actions, actionsProp]
  )
  return (
    <AntdButton style={style} {...antdProps} {...events}>
      {content}
    </AntdButton>
  )
}

const ButtonPropsForm: typeof Button['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性设置" key="props">
        <Form.Item name={propItemName('content')} label="内容">
          <Input />
        </Form.Item>

        <Form.Item name={propItemName('type')} label="按钮类型">
          <Select allowClear>
            {buttonTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={propItemName('danger')}
          label="危险按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('ghost')}
          label="幽灵按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('disabled')}
          label="失效按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('block')}
          label="块级按钮"
          valuePropName="checked"
        >
          <Switch />
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

Button.PropsForm = ButtonPropsForm

Button.getInitialStyle = () => ({
  display: 'inline-block',
})
Button.getInitialProps = () => ({
  content: '按钮',
  type: 'default',
})
Button.nodeName = 'button'
Button.title = '按钮'
Button.getId = () => getId('button')
export default Button
