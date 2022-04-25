import { getId } from '@/utils'
import {} from '@ant-design/icons'
import { Collapse, Form, Input, InputProps, Radio, Switch } from 'antd'
import React, { useMemo } from 'react'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import SvgIcon from '@/components/svg-icon'
import InputSvg from '../../../assets/components/input.svg?raw'
import VariableBinding from '../../variable-binding'

export interface NodeInputProps extends InputProps {
  type: 'text' | 'textarea' | 'password'
}

const NodeInput: NodeComponent<NodeInputProps> = ({ node, editType }) => {
  const { props, style, actions: actionsProp } = node
  const { type } = props
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const inputs = useMemo(() => {
    return {
      text: Input,
      password: Input.Password,
      textarea: Input.TextArea,
    }
  }, [])
  return React.createElement(inputs[type] as React.ElementType<InputProps>, {
    style,
    ...events,
    ...props,
  })
}

const NodeInputPropsForm: typeof NodeInput['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="默认值" name={propItemName('defaultValue')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="占位值" name={propItemName('placeholder')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="类型" name={propItemName('type')}>
          <VariableBinding>
            <Radio.Group>
              <Radio.Button value="text">单行</Radio.Button>
              <Radio.Button value="textarea">多行</Radio.Button>
              <Radio.Button value="password">密码</Radio.Button>
            </Radio.Group>
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="是否有边框"
          name={propItemName('bordered')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="清除按钮"
          name={propItemName('allowClear')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="自动聚焦"
          name={propItemName('autoFocus')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction
            menus={[
              { event: 'onClick', title: '点击文本' },
              { event: 'onChange', title: '输入框变化' },
              { event: 'onPressEnter', title: '按下回车' },
            ]}
          />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
NodeInput.PropsForm = NodeInputPropsForm
NodeInput.nodeName = 'input'
NodeInput.title = '输入框'
NodeInput.getInitialStyle = () => ({
  display: 'flex',
})
NodeInput.getInitialProps = () => ({
  placeholder: '请输入',
  bordered: true,
  type: 'text',
})
NodeInput.getId = () => getId('input')
NodeInput.icon = <SvgIcon raw={InputSvg} />
export default NodeInput
