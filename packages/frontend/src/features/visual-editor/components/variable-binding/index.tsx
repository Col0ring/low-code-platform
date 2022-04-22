import React, { useMemo, useState } from 'react'
import { Modal, Button, Form, Select, Tooltip, Input } from 'antd'
import { ForkOutlined } from '@ant-design/icons'
import { useEditorPreviewContext } from '../editor-preview/provider'
import { BindingValue } from '../../type'

export function isBindVariable(v: any): v is BindingValue {
  return !!v?.__BINDING__
}

export interface VariableBindingProps {
  trigger?: string
  valuePropName?: string
  [key: string]: any
}

const VariableBinding: React.FC<VariableBindingProps> = ({
  children,
  trigger = 'onChange',
  valuePropName = 'value',
  ...props
}) => {
  const [visible, setVisible] = useState(false)
  const isWrapperValue = useMemo(
    () => isBindVariable(props[valuePropName]),
    [props, valuePropName]
  )
  const isBinding = useMemo(
    () => isWrapperValue && props[valuePropName].type === 'binding',
    [isWrapperValue, props, valuePropName]
  )
  const [form] = Form.useForm()
  const { dataSources } = useEditorPreviewContext()
  const dataSourcesArr = useMemo(() => Object.keys(dataSources), [dataSources])

  if (React.Children.only(children) && React.isValidElement(children)) {
    return (
      <>
        <div className="flex justify-between">
          {React.cloneElement(children, {
            ...props,
            disabled: isBinding,
            [valuePropName]: isBinding
              ? undefined
              : isWrapperValue
              ? props[valuePropName].value
              : props[valuePropName],
            [trigger]: (e: any) => {
              if (isBinding) {
                return
              }
              props[trigger]({
                __BINDING__: true,
                type: 'normal',
                value: e?.target?.value ?? e,
              })
            },
          })}
          <Tooltip title="绑定变量">
            <Button
              onClick={() => setVisible(true)}
              className="ml-1"
              type="text"
              icon={
                <ForkOutlined className={isBinding ? 'text-blue-500' : ''} />
              }
            />
          </Tooltip>
        </div>
        <Modal
          title="变量绑定"
          destroyOnClose
          onCancel={() => setVisible(false)}
          visible={visible}
          footer={
            <div className="flex justify-between">
              <Button
                size="middle"
                danger
                type="primary"
                disabled={!isBinding}
                onClick={() => {
                  props[trigger]({
                    __BINDING__: true,
                    type: 'normal',
                    value: undefined,
                  })
                  setVisible(false)
                }}
              >
                移除绑定
              </Button>
              <div>
                <Button size="middle" onClick={() => setVisible(false)}>
                  取消
                </Button>
                <Button
                  size="middle"
                  type="primary"
                  className="ml-2"
                  onClick={async () => {
                    try {
                      const { expr } = await form.validateFields()
                      props[trigger]({
                        __BINDING__: true,
                        type: 'binding',
                        value: expr,
                      })
                    } catch (error) {
                      //
                    }
                    setVisible(false)
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          }
        >
          <Select
            className="w-full"
            size="middle"
            showSearch
            allowClear
            value=""
            onSelect={(val: string) => {
              form.setFieldsValue({
                expr:
                  ((form.getFieldValue('expr') as string) || '') +
                  ` state.${val}`,
              })
            }}
            placeholder="选择数据源快速绑定"
            filterOption={(input, option) =>
              option
                ? `${option.value}`
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                : false
            }
          >
            {dataSourcesArr.map((key) => {
              return (
                <Select.Option value={key} key={key}>
                  {key}
                </Select.Option>
              )
            })}
          </Select>
          <Form
            className="mt-2"
            layout="vertical"
            form={form}
            preserve={false}
            size="middle"
            initialValues={{
              expr: isBinding ? props[valuePropName].value : '',
            }}
          >
            <Form.Item
              label="变量表达式"
              name="expr"
              tooltip="可以输入任意 JS 表达式，返回值会作为值绑定"
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }

  return null
}

export default VariableBinding