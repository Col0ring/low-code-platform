import ModalButton from '@/components/modal-button'
import { useEditorContext } from '@/features/visual-editor/provider'
import { DataSources, RemoteDataSource } from '@/features/visual-editor/type'
import { stopPropagation } from '@/utils'
import { emptyValidator } from '@/utils/validators'
import { EditOutlined } from '@ant-design/icons'
import { Form, Input, message } from 'antd'
import React, { useState } from 'react'
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
      modalTitle={type === 'add' ? '新增变量' : '编辑变量'}
      onClick={type === 'edit' ? stopPropagation : undefined}
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
          initialValues={type === 'edit' ? props.initialValues : undefined}
          form={form}
          layout="vertical"
          preserve={false}
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
            label={
              <div>
                <p>数据</p>
                <p className="text-gray-400 text-xs">请输入 JS 标准数据</p>
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
                type: 'var',
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
                type: 'var',
                ...values,
              },
            })
          }
        }
      }}
      renderButton={
        type === 'add' ? (btnProps) => <div {...btnProps}>变量</div> : undefined
      }
    />
  )
}

export default RemoteFormButton
