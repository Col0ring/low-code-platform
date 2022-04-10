import { Form, Input, Collapse } from 'antd'
import React from 'react'
import { ParentComponentRenderNode } from '../../type'
import { styleItemName } from '../node-components'

export interface StyleTabProps {
  node: ParentComponentRenderNode
}
const StyleTab: React.FC<StyleTabProps> = () => {
  return (
    <Collapse defaultActiveKey={['style']} bordered={false}>
      <Collapse.Panel header="样式设置" key="style">
        <Form.Item name={styleItemName('width')} label="宽">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('height')} label="高">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('minWidth')} label="最小宽度">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('minHeight')} label="最小高度">
          <Input />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

export default StyleTab
