import { getId } from '@/utils'
import { AlertOutlined } from '@ant-design/icons'
import {
  Collapse,
  Form,
  Input,
  Alert as AntdAlert,
  AlertProps as AntdAlertProps,
  Switch,
  Select,
} from 'antd'
import React, { useMemo } from 'react'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import VariableBinding from '../../variable-binding'

export type AlertProps = AntdAlertProps

const Alert: NodeComponent<AlertProps> = ({ node, editType }) => {
  const { props, style, actions: actionsProp } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  return <AntdAlert style={style} {...props} {...events} />
}

const AlertPropsForm: typeof Alert['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="提示内容" name={propItemName('message')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="辅助内容" name={propItemName('description')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="提示类型" name={propItemName('type')}>
          <VariableBinding>
            <Select>
              <Select.Option value="success">成功</Select.Option>
              <Select.Option value="info">信息</Select.Option>
              <Select.Option value="warning">警告</Select.Option>
              <Select.Option value="error">失败</Select.Option>
            </Select>
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="显示图标"
          name={propItemName('showIcon')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="是否可关闭"
          name={propItemName('closable')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击警告提示' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Alert.PropsForm = AlertPropsForm
Alert.nodeName = 'alert'
Alert.title = '警告提示'
Alert.getInitialStyle = () => ({})
Alert.getInitialProps = () => ({
  message: '警告提示',
  description: '描述信息',
  showIcon: true,
  closable: false,
})
Alert.getId = () => getId('alert')
Alert.icon = <AlertOutlined />
export default Alert
