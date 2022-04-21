import React, { useMemo, useState } from 'react'
import { Modal, Button, Form, Select, Tooltip } from 'antd'
import { ForkOutlined } from '@ant-design/icons'
import { useEditorPreviewContext } from '../editor-preview/provider'
import { BindingValue } from '../../type'
import { emptyValidator } from '@/utils/validators'

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
                      const { name } = await form.validateFields()
                      props[trigger]({
                        __BINDING__: true,
                        type: 'binding',
                        value: name,
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
          <Form form={form} preserve={false} size="middle">
            <Form.Item
              label="变量名称"
              name="name"
              rules={[
                emptyValidator('变量名称', {
                  message: '请选择变量名称',
                }),
              ]}
            >
              <Select
                showSearch
                placeholder="请选择数据源"
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
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }

  return null
}

export default VariableBinding
