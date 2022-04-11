import React from 'react'
import {
  Button as AntdButton,
  Collapse,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Switch,
} from 'antd'
import { NodeComponent } from '@/features/visual-editor/type'
import { getId, noop } from '@/utils'
import ActionModal from '../../action-modal'
import { propItemName } from '..'
import { useEditorPreviewContext } from '../../editor-preview/provider'

const buttonTypes = ['primary', 'default', 'dashed', 'link', 'text'] as const

export interface ButtonProps {
  type?: typeof buttonTypes[number]
  content?: string
  actions?: {
    onClick?: {
      actionType: 'js' | 'internal'
      actionEvent: 'openUrl'
      value: Record<string, any>
    }[]
  }
}

const Button: NodeComponent<ButtonProps> = ({ node }) => {
  const { props } = node
  const { content, actions: actionsProp, ...antdProps } = props
  const { actions } = useEditorPreviewContext()
  return (
    <AntdButton
      onClick={() => {
        actionsProp?.onClick?.forEach(({ actionType, actionEvent, value }) => {
          actions[actionType][actionEvent](value)
        })
      }}
      {...antdProps}
    >
      {content}
    </AntdButton>
  )
}

interface DisplayActionModal {
  value?: Record<
    string,
    {
      actionType: string
      actionEvent: string
      value: Record<string, any>
    }[]
  >
  onChange?: (
    value: Record<
      string,
      {
        actionType: string
        actionEvent: string
        value: Record<string, any>
      }[]
    >
  ) => void
}

const DisplayActionModal: React.FC<DisplayActionModal> = ({
  value = {},
  onChange = noop,
}) => {
  return (
    <Dropdown
      placement="bottom"
      overlay={
        <Menu>
          <Menu.Item key="click">
            <ActionModal
              modalProps={{ title: '当点击时' }}
              onOk={(values) => {
                if (value['onClick']) {
                  onChange({
                    ...value,
                    onClick: [...value['onClick'], values],
                  })
                } else {
                  onChange({
                    ...value,
                    onClick: [values],
                  })
                }
              }}
            >
              点击按钮
            </ActionModal>
          </Menu.Item>
        </Menu>
      }
    >
      <AntdButton className="mt-3" type="primary" size="middle" block>
        新建动作
      </AntdButton>
    </Dropdown>
  )
}

const ButtonPropsForm: typeof Button['PropsForm'] = ({ node }) => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性设置" key="props">
        <Form.Item name={propItemName('content')} label="内容">
          <Input />
        </Form.Item>

        <Form.Item name={propItemName('type')} label="按钮类型">
          <Select allowClear>
            {buttonTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={propItemName('danger')}
          label="危险按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('ghost')}
          label="幽灵按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('disabled')}
          label="失效按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={propItemName('block')}
          label="块级按钮"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name={propItemName('actions')}>
          <DisplayActionModal />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

Button.PropsForm = ButtonPropsForm

Button.getInitialStyle = () => ({})
Button.getInitialProps = () => ({
  content: '按钮',
  type: 'default',
})
Button.nodeName = 'button'
Button.title = '按钮'
Button.getId = () => getId('button')
export default Button
