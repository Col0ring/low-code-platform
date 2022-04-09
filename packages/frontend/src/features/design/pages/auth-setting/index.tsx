import React from 'react'
import { Button, Form, message, Switch } from 'antd'
import { Page } from '@/features/app/type'
import { App } from '@/features/main/type'
import { useOutletContext } from 'react-router-dom'
import { useUpdatePageMutation } from '@/features/app/app.service'
import { isResolved } from '@/utils'
import { PageStatus } from '@/features/app/constants'

const AuthSettingPage = () => {
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
        <h2 className="font-bold text-lg">权限设置</h2>
        <div className="w-3/5 mt-5">
          <Form
            form={form}
            initialValues={{
              status: page.status === PageStatus.Active,
            }}
          >
            <Form.Item
              valuePropName="checked"
              name="status"
              label="页面状态"
              tooltip="启用后可在应用中访问页面路径"
              rules={[
                {
                  required: true,
                  type: 'boolean',
                  message: '请选择页面状态',
                },
              ]}
            >
              <Switch checkedChildren="已启用" unCheckedChildren="未启用" />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          onClick={async () => {
            const { status } = (await form.validateFields()) as {
              status: boolean
            }
            const res = await reqUpdatePage({
              appId: page.app.id,
              pageId: page.id,
              data: {
                status: status ? PageStatus.Active : PageStatus.Inactive,
              },
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

export default AuthSettingPage
