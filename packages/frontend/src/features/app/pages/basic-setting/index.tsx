import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { emptyValidator } from '@/utils/validators'
import { useOutletContext } from 'react-router'
import { App } from '@/features/main/type'
import { useUpdateAppMutation } from '../../app.service'
import { isResolved } from '@/utils'
import ImageUploader from '@/features/upload/components/image-uploader'

const BasicSettingPage = () => {
  const app = useOutletContext<App>()
  const [form] = Form.useForm()
  const [reqUpdateApp] = useUpdateAppMutation()
  return (
    <div className="h-full overflow-auto p-4">
      <div className="bg-white p-4 rounded-md">
        <h2 className="font-bold text-lg">基础属性</h2>
        <div className="w-3/5 mt-5">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: app.name,
              desc: app.desc,
              icon: app.icon,
            }}
          >
            <Form.Item
              name="name"
              label="应用名称"
              rules={[emptyValidator('应用名称')]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="icon" label="应用图标">
              <ImageUploader />
            </Form.Item>
            <Form.Item name="desc" label="应用描述">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          onClick={async () => {
            const values = await form.validateFields()
            const res = await reqUpdateApp({
              ...values,
              id: app.id,
            })
            if (isResolved(res)) {
              void message.success('保存成功')
            }
          }}
        >
          保存
        </Button>
      </div>
    </div>
  )
}

export default BasicSettingPage
