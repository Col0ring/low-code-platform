import React, { useMemo } from 'react'
import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  SpinProps,
  Switch,
} from 'antd'
import { NodeComponent } from '@/features/visual-editor/type'
import { getId } from '@/utils'
import { Loading3QuartersOutlined } from '@ant-design/icons'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import { parserActions, propItemName, renderNodes } from '..'
import BlankContent from '../../blank-content'
import NodeContainer from '../../node-container'
import VariableBinding from '../../variable-binding'
import AddAction from '../../add-action/inidex'

export type LoadingProps = SpinProps

const Loading: NodeComponent<LoadingProps> = ({
  node,
  parentNodes,
  disabled,
  editType,
}) => {
  const { props, children, actions: actionsProp, style } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )

  return (
    <Spin style={style} {...events} {...props}>
      {editType === 'prod' ? (
        renderNodes(children)
      ) : children.length === 0 ? (
        <BlankContent disabled={disabled} node={node} />
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
    </Spin>
  )
}
const LoadingPropsForm: typeof Loading['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="描述文案" name={propItemName('tip')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="加载中"
          name={propItemName('spinning')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="尺寸" name={propItemName('size')}>
          <VariableBinding>
            <Select>
              <Select.Option value="large">大</Select.Option>
              <Select.Option value="small">小</Select.Option>
              <Select.Option value="default">默认</Select.Option>
            </Select>
          </VariableBinding>
        </Form.Item>
        <Form.Item label="延迟加载时间" name={propItemName('delay')}>
          <VariableBinding>
            <InputNumber />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Loading.PropsForm = LoadingPropsForm
Loading.nodeName = 'loading'
Loading.title = '加载中'
Loading.getInitialStyle = () => ({})
Loading.getInitialProps = () => ({
  spinning: false,
  tip: '加载中...',
  size: 'default',
})
Loading.getId = () => getId('loading')
Loading.getInitialChildren = () => []
Loading.icon = <Loading3QuartersOutlined />
export default Loading
