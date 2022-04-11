import { getId } from '@/utils'
import { Collapse, Form, Input } from 'antd'
import React from 'react'
import { propItemName } from '..'
import { NodeComponent } from '../../../type'

export interface TextProps {
  content: string
}

const Text: NodeComponent<TextProps> = ({ node }) => {
  const { props } = node
  return <span style={{ lineHeight: 1 }}>{props.content}</span>
}

const TextPropsForm: typeof Text['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="内容" name={propItemName('content')}>
          <Input />
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
export default Text
