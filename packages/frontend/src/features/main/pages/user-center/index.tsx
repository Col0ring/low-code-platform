import { useUpdateUserMutation } from '@/features/auth/auth.service'
import ImageUploader from '@/features/upload/components/image-uploader'
import { useAuth } from '@/hooks'
import { isResolved } from '@/utils'
import { emptyValidator } from '@/utils/validators'
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import React from 'react'

const UserCenter: React.FC = () => {
  const { user } = useAuth()
  const [reqUpdateUser, { isLoading }] = useUpdateUserMutation()
  return (
    <Card title="用户信息">
      <Form
        initialValues={user || undefined}
        labelCol={{ span: 2 }}
        onFinish={async (values) => {
          const { username, avatar } = values
          const res = await reqUpdateUser({ username, avatar })
          if (isResolved(res)) {
            void message.success('修改成功')
            return
          }
          void message.error('修改失败')
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[emptyValidator('用户名')]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            autoComplete="username"
          />
        </Form.Item>
        <Form.Item name="avatar" label="头像">
          <ImageUploader />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input
            disabled
            prefix={<PhoneOutlined />}
            placeholder="Phone"
            autoComplete="phone"
          />
        </Form.Item>
        <Form.Item name="email" label="邮 箱">
          <Input
            disabled
            prefix={<MailOutlined />}
            placeholder="Email"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end">
            <Button loading={isLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default UserCenter
