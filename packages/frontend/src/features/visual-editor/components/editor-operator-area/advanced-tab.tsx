import { QuestionCircleOutlined } from '@ant-design/icons'
import { Collapse, Form, Input, Switch, Tooltip } from 'antd'
import React from 'react'
import { ParentComponentRenderNode } from '../../type'
import { advancedItemName } from '../node-components'
import VariableBinding from '../variable-binding'
import EditCycleData from './edit-cycle-data'

export interface AdvancedTabProps {
  node: ParentComponentRenderNode
}

const AdvancedTab: React.FC<AdvancedTabProps> = () => {
  return (
    <Collapse defaultActiveKey={['condition', 'cycle']} bordered={false}>
      <Collapse.Panel header="条件设置" key="condition">
        <Form.Item
          label="是否渲染"
          valuePropName="checked"
          name={advancedItemName('condition', 'isRender')}
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel
        header="循环设置"
        extra={
          <Tooltip title="当设置循环时，当前组件的变量变量会新增对应的 item 与 index">
            <QuestionCircleOutlined />
          </Tooltip>
        }
        key="cycle"
      >
        <Form.Item label="循环数据" name={advancedItemName('cycle', 'data')}>
          <VariableBinding>
            <EditCycleData />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="迭代变量名" name={advancedItemName('cycle', 'item')}>
          <VariableBinding>
            <Input placeholder="默认值为 item" />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="索引变量名" name={advancedItemName('cycle', 'index')}>
          <VariableBinding>
            <Input placeholder="默认值为 index" />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="循环 key"
          name={advancedItemName('cycle', 'key')}
          tooltip="默认值绑定为当前 item 的 index"
        >
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

export default AdvancedTab
