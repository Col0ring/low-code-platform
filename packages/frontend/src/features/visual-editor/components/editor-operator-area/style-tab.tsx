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
        <Form.Item name={styleItemName('padding')} label="内边距">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('border')} label="边框">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('fontSize')} label="文本尺寸">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('fontWeight')} label="字体粗细">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('lineHeight')} label="字体行高">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('textAlign')} label="文本水平对齐方式">
          <Select>
            <Select.Option value="left">left</Select.Option>
            <Select.Option value="center">center</Select.Option>
            <Select.Option value="right">right</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={styleItemName('verticalAlign')}
          label="文本水平对齐方式"
        >
          <Select>
            <Select.Option value="baseline">baseline</Select.Option>
            <Select.Option value="top">top</Select.Option>
            <Select.Option value="middle">middle</Select.Option>

            <Select.Option value="bottom">bottom</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name={styleItemName('background')} label="背景">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('shadow')} label="阴影">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('opacity')} label="不透明度">
          <Input />
        </Form.Item>
        <Form.Item name={styleItemName('cursor')} label="鼠标手势">
          <Select>
            <Select.Option value="default">default</Select.Option>
            <Select.Option value="pointer">pointer</Select.Option>
          </Select>
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

export default StyleTab
