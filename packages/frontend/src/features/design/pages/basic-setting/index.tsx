import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { emptyValidator } from '@/utils/validators'
import { Page } from '@/features/app/type'
import { App } from '@/features/main/type'
import { useOutletContext } from 'react-router-dom'
import { useUpdatePageMutation } from '@/features/app/app.service'
import { isResolved } from '@/utils'

const BasicSettingPage = () => {
  const page = useOutletContext<
    Page & {
      app: App
    }
  >()
  const [reqUpdatePage] = useUpdatePageMutation()

  const [form] = Form.useForm()
  return (
    <div className="h-full overflow-auto p-4">
      <div className="bg-white p-4 rounded-md">
        <h2 className="font-bold text-lg">基础属性</h2>
        <div className="w-3/5 mt-5">
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              name: page.name,
              path: page.path,
            }}
          >
            <Form.Item
              name="name"
              label="页面名称"
              rules={[emptyValidator('页面名称')]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="path"
              label="页面路径"
              rules={[emptyValidator('页面路径')]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          onClick={async () => {
            const values = await form.validateFields()
            const res = await reqUpdatePage({
              appId: page.app.id,
              pageId: page.id,
              data: values,
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
