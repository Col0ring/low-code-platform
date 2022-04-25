import { getId } from '@/utils'
import { FileTextOutlined } from '@ant-design/icons'
import { Collapse, Form, Input } from 'antd'
import React, { useMemo } from 'react'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'

export interface TextProps {
  content: string
}

const Text: NodeComponent<TextProps> = ({ node, editType }) => {
  const { props, style, actions: actionsProp } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  return (
    <span style={style} {...events}>
      {props.content}
    </span>
  )
}

const TextPropsForm: typeof Text['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="内容" name={propItemName('content')}>
          <Input />
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击文本' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Text.PropsForm = TextPropsForm
Text.nodeName = 'text'
Text.title = '文本'
Text.getInitialStyle = () => ({
  display: 'inline',
})
Text.getInitialProps = () => ({
  content: '文本',
})
Text.getId = () => getId('text')
Text.icon = <FileTextOutlined />
export default Text
