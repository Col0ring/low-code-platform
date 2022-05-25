import ModalButton from '@/components/modal-button'
import { MonacoEditor } from '@/components/monaco-editor'
import { useEditorContext } from '@/features/visual-editor/provider'
import { DataSources, RemoteDataSource } from '@/features/visual-editor/type'
import { emptyValidator } from '@/utils/validators'
import { EditOutlined } from '@ant-design/icons'
import { Form, Input, message, Radio, Switch } from 'antd'
import React, { useState } from 'react'
import VariableBinding, {
  isBindVariable,
  isWrapperValue,
} from '../../../variable-binding'
export type RemoteFormButtonProps =
  | {
      type: 'add'
    }
  | {
      type: 'edit'
      initialValues: RemoteDataSource
    }
const RemoteFormButton: React.FC<RemoteFormButtonProps> = (props) => {
  const { type } = props
  const [{ page }, { updatePageData }] = useEditorContext()
  const [form] = Form.useForm()
  const [editData, setEditData] = useState<DataSources | null>(null)
  return (
    <ModalButton
      modalProps={{
        width: '80%',
        style: {
          top: 10,
        },
      }}
      modalTitle={type === 'add' ? '新增远程 API' : '编辑远程 API'}
      type="text"
      icon={type === 'edit' ? <EditOutlined /> : undefined}
      afterModalClose={() => {
        if (editData) {
          updatePageData({
            dataSources: editData,
          })
        }
      }}
      modal={
        <Form
          initialValues={
            type === 'edit'
              ? props.initialValues
              : {
                  fetch: {
                    data: `{
"params": {},
"body": {},
"headers": {}
}`,
                  },
                  hooks: `/*
  发送请求前
*/
export const beforeFetch = (config) => {
  // config 为请求前的配置项，可通过 config.url = xx 来修改配置
};

/*
  发送请求后
*/
export const afterFetch = (res, error) => {
  // res 为返回的结果，error 为 fetch 失败后的错误，data 与 error 有且只有一个有值，另一个值为 null
  // 必须要返回值
  return res.data;
};`,
                }
          }
          form={form}
          preserve={false}
          labelCol={{ span: 3 }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[emptyValidator('变量名称')]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input />
          </Form.Item>
          <Form.Item
            label="自动加载"
            name="autoLoad"
            valuePropName="checked"
            tooltip="当页面首次加载时自动执行"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="发送请求"
            name="doFetch"
            valuePropName="checked"
            tooltip="每次调用请求时都会进行判断"
          >
            <VariableBinding valuePropName="checked">
              <Switch />
            </VariableBinding>
          </Form.Item>
          <Form.Item
            label="请求地址"
            name={['fetch', 'url']}
            rules={[
              emptyValidator('请求地址', {
                transform(v) {
                  if (isWrapperValue(v)) {
                    if (isBindVariable(v)) {
                      return 'success'
                    } else {
                      return v.value
                    }
                  }
                  return v
                },
              }),
            ]}
          >
            <VariableBinding>
              <Input />
            </VariableBinding>
          </Form.Item>
          <Form.Item
            label="请求方法"
            name={['fetch', 'method']}
            rules={[
              emptyValidator('请求方法', {
                message: '请选择请求方法',
                transform(v) {
                  if (isWrapperValue(v)) {
                    if (isBindVariable(v)) {
                      return 'success'
                    } else {
                      return v.value
                    }
                  }
                  return v
                },
              }),
            ]}
          >
            <VariableBinding>
              <Radio.Group>
                <Radio.Button value="GET">GET</Radio.Button>
                <Radio.Button value="POST">POST</Radio.Button>
                <Radio.Button value="PUT">PUT</Radio.Button>
                <Radio.Button value="DELETE">DELETE</Radio.Button>
              </Radio.Group>
            </VariableBinding>
          </Form.Item>
          <Form.Item label="请求参数" name={['fetch', 'data']}>
            <VariableBinding>
              <MonacoEditor
                className="h-200px border"
                language="json"
                scrollBeyondLastLine={false}
                minimap={{
                  enabled: false,
                }}
              />
            </VariableBinding>
          </Form.Item>
          <Form.Item label="数据处理" name="hooks">
            <MonacoEditor
              className="h-300px border"
              formatOnSave
              scrollBeyondLastLine={false}
              minimap={{
                enabled: false,
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <div className="whitespace-normal">
                <p>默认数据</p>
                <p className="text-gray-400 text-xs text">请输入 JS 标准数据</p>
              </div>
            }
            name="defaultValue"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      }
      onModalOK={async () => {
        const values = await form.validateFields()
        if (type === 'add') {
          if (page.dataSources[values.name]) {
            void message.error('数据源已存在')
            return Promise.reject()
          }
          updatePageData({
            dataSources: {
              ...page.dataSources,
              [values.name]: {
                type: 'remote',
                ...values,
              },
            },
          })
        } else if (type === 'edit') {
          if (props.initialValues?.name === values.name) {
            updatePageData({
              dataSources: {
                ...page.dataSources,
                [values.name]: {
                  ...page.dataSources[values.name],
                  ...values,
                },
              },
            })
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [props.initialValues.name]: _, ...dataSources } =
              page.dataSources

            if (dataSources[values.name]) {
              void message.error('数据源已存在')
              return Promise.reject()
            }
            setEditData({
              ...dataSources,
              [values.name]: {
                type: 'remote',
                ...values,
              },
            })
          }
        }
      }}
      renderButton={
        type === 'add'
          ? (btnProps) => <div {...btnProps}>远程 API</div>
          : undefined
      }
    />
  )
}

export default RemoteFormButton
