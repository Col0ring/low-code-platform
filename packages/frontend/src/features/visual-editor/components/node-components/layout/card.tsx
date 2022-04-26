import { getId } from '@/utils'
import {
  Collapse,
  Form,
  Card as AntdCard,
  CardProps as AntdCardProps,
  Input,
  Switch,
  Select,
} from 'antd'
import React, { useMemo } from 'react'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import VariableBinding from '../../variable-binding'
import SvgIcon from '@/components/svg-icon'
import CardIcon from '../../../assets/components/card.svg?raw'
export interface CardProps extends AntdCardProps {
  inner?: boolean
}

const Card: NodeComponent<CardProps> = ({ node, editType }) => {
  const { props, style, actions: actionsProp } = node
  const { inner, ...antdProps } = props
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  return (
    <AntdCard
      type={inner ? 'inner' : undefined}
      style={style}
      {...antdProps}
      {...events}
    />
  )
}

const CardPropsForm: typeof Card['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="卡片标题" name={propItemName('title')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="卡片大小" name={propItemName('size')}>
          <VariableBinding>
            <Select>
              <Select.Option value="default">默认</Select.Option>
              <Select.Option value="small">小</Select.Option>
            </Select>
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="边框"
          name={propItemName('bordered')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="鼠标移过浮起"
          name={propItemName('hoverable')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="内嵌卡片"
          name={propItemName('inner')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击卡片' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Card.PropsForm = CardPropsForm
Card.nodeName = 'card'
Card.title = '卡片'
Card.getInitialStyle = () => ({})
Card.getInitialProps = () => ({
  title: '卡片标题',
  bordered: true,
  hoverable: false,
  size: 'default',
  inner: false,
})
Card.getId = () => getId('card')
Card.icon = <SvgIcon raw={CardIcon} />
export default Card
