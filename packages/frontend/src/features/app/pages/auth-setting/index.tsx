import React from 'react'
import { Button, Form, message, Switch } from 'antd'
import { App } from '@/features/main/type'
import { useOutletContext } from 'react-router-dom'
import { useUpdateAppMutation } from '@/features/app/app.service'
import { isResolved } from '@/utils'
import { AppStatus } from '@/features/main/constants'

const AuthSettingPage = () => {
  const app = useOutletContext<App>()
  const [reqUpdateApp] = useUpdateAppMutation()
  const [form] = Form.useForm()
  return (
    <div className="h-full overflow-auto p-4">
      <div className="bg-white p-4 rounded-md">
        <h2 className="font-bold text-lg">权限设置</h2>
        <div className="w-3/5 mt-5">
          <Form
            form={form}
            initialValues={{
              status: app.status === AppStatus.Active,
            }}
          >
            <Form.Item
              valuePropName="checked"
              name="status"
              label="应用状态"
              tooltip="启用后可通过 Web 端访问应用"
              rules={[
                {
                  required: true,
                  type: 'boolean',
                  message: '请选择应用状态',
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
            const res = await reqUpdateApp({
              id: app.id,
              status: status ? AppStatus.Active : AppStatus.Inactive,
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
