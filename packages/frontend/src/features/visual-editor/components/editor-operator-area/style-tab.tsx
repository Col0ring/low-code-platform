import { Form, Input, Collapse, Select } from 'antd'
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
        <Form.Item label="显示" name={styleItemName('display')}>
          <Select>
            <Select.Option value="flex">flex</Select.Option>
            <Select.Option value="inline-flex">inline-flex</Select.Option>
            <Select.Option value="block">block</Select.Option>
            <Select.Option value="inline-block">inline-block</Select.Option>
            <Select.Option value="inline">inline</Select.Option>
          </Select>
        </Form.Item>
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
        <Form.Item name={styleItemName('margin')} label="外边距">
          <Input />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

export default StyleTab
