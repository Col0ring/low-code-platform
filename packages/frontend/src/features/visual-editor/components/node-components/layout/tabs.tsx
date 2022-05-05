import React, { useMemo, useState, useEffect } from 'react'
import { NodeComponent } from '../../../type'
import { getId, noop } from '@/utils'
import NodeContainer from '../../node-container'
import { createNewNode, parserActions, propItemName, renderNode } from '..'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import {
  Button,
  Collapse,
  Form,
  Select,
  Radio,
  Tabs as AntdTabs,
  Input,
  message,
  Switch,
} from 'antd'
import AddAction from '../../add-action/inidex'
import { useEditorContext } from '@/features/visual-editor/provider'
import Layout from './layout'
import { DeleteRowOutlined } from '@ant-design/icons'
import VariableBinding from '../../variable-binding'
import SvgIcon from '@/components/svg-icon'
import TabsIcon from '../../../assets/components/tabs.svg?raw'

const layoutName = Layout.nodeName

interface addTabButtonProps {
  value?: {
    activeKey: string
    tabs: { title: string }[]
  }
  onChange?: (value: any) => void
  disabled?: boolean
}

const AddTabButton: React.FC<addTabButtonProps> = ({
  value = {} as NonNullable<addTabButtonProps['value']>,
  onChange = noop,
  disabled,
}) => {
  const { tabs = [{ title: '标签项' }], activeKey = '0' } = value
  return (
    <div>
      <Radio.Group
        disabled={disabled}
        className="w-full"
        value={activeKey}
        onChange={(e) => {
          onChange({ ...value, activeKey: e.target.value })
        }}
      >
        {tabs.map(({ title }, index) => {
          return (
            <div
              className="rounded-sm flex p-1 mb-2 border-gray-200 border border-solid hover:bg-gray-100"
              key={index}
            >
              <Radio className="w-full" value={`${index}`}>
                <Input
                  disabled={disabled}
                  value={title}
                  onChange={(e) => {
                    onChange({
                      ...value,
                      tabs: [
                        ...tabs.slice(0, index),
                        { title: e.target.value },
                        ...tabs.slice(index + 1),
                      ],
                    })
                  }}
                />
              </Radio>
              <Button
                disabled={disabled}
                type="text"
                danger
                onClick={() => {
                  if (tabs.length === 1) {
                    void message.error('至少保留一项选项卡')
                    return
                  }
                  onChange({
                    ...value,
                    activeKey:
                      value.activeKey === `${index}`
                        ? `${index === tabs.length - 1 ? index - 1 : index}`
                        : value.activeKey,
                    tabs: tabs.filter((tab, i) => i !== index),
                  })
                }}
              >
                <DeleteRowOutlined />
              </Button>
            </div>
          )
        })}
      </Radio.Group>
      <Button
        disabled={disabled}
        type="primary"
        block
        onClick={() => {
          onChange({
            ...value,
            tabs: [...tabs, { title: '标签项' }],
          })
        }}
      >
        添加一项
      </Button>
    </div>
  )
}

export interface TabsProps {
  size?: 'middle' | 'small' | 'large'
  value: {
    activeKey: string
    tabs: { title: string }[]
  }
  interControllable?: boolean
}

const Tabs: NodeComponent<TabsProps> = ({
  node,
  parentNodes,
  disabled,
  editType,
}) => {
  const { children, props, actions: actionsProp, style } = node
  const { value, interControllable, ...tabsProps } = props

  const [active, setActive] = useState(value.activeKey)
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const [, { updateComponentNode }] = useEditorContext(false) || [{}, {}]
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )

  useEffect(() => {
    setActive(value.activeKey)
  }, [value.activeKey])

  useEffect(() => {
    if (editType === 'edit') {
      if (children.length !== value.tabs.length) {
        const extraChildren =
          value.tabs.length > children.length
            ? new Array(value.tabs.length - children.length)
                .fill(0)
                .map(() => createNewNode(layoutName))
            : []
        updateComponentNode?.({
          type: 'update',
          addSnapshot: false,
          node,
          props: node.props,
          children: [
            ...node.children.slice(0, value.tabs.length),
            ...extraChildren,
          ],
        })
      }
    }
  }, [children.length, editType, node, updateComponentNode, value.tabs.length])
  return (
    <AntdTabs
      {...tabsProps}
      {...events}
      style={style}
      activeKey={active}
      onChange={interControllable ? setActive : undefined}
    >
      {value.tabs.map(({ title }, index) => {
        const child = children[index]
        return (
          <AntdTabs.TabPane style={{ padding: 2 }} tab={title} key={index}>
            {child &&
              (editType === 'edit' ? (
                <NodeContainer
                  disabled={disabled}
                  index={index}
                  key={child.id}
                  node={child}
                  parentNodes={childParentNodes}
                />
              ) : (
                renderNode(child)
              ))}
          </AntdTabs.TabPane>
        )
      })}
    </AntdTabs>
  )
}

const TabsPropsForm: typeof Tabs['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item name={propItemName('value')}>
          <VariableBinding>
            <AddTabButton />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="内部可控"
          name={propItemName('interControllable')}
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
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击选项卡' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Tabs.childActionDisabled = true
Tabs.PropsForm = TabsPropsForm
Tabs.nodeName = 'tabs'
Tabs.title = '选项卡'
Tabs.getInitialProps = () => ({
  value: {
    tabs: [{ title: '标签项' }, { title: '标签项' }],
    activeKey: '0',
  },
  interControllable: true,
})
Tabs.getInitialStyle = () => ({ display: 'block' })
Tabs.getInitialChildren = () => []
Tabs.getId = () => getId('tabs')
Tabs.icon = <SvgIcon raw={TabsIcon} />
export default Tabs
