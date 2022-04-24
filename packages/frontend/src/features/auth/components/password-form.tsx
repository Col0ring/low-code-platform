import React from 'react'
import { Form, Button, Input, FormProps } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { emailValidator, emptyValidator } from '@/utils/validators'
export interface PasswordFormProps {
  onLogin: (email: string, password: string) => void
  loading: boolean
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onLogin, loading }) => {
  const onFinish: FormProps['onFinish'] = (values) => {
    const { email, password } = values
    onLogin(email, password)
  }
  return (
    <Form
      size="large"
      labelCol={{
        span: 5,
      }}
      initialValues={{
        email: '1561999073@qq.com',
        password: '1',
      }}
      onFinish={onFinish}
      className="pt-7"
    >
      <Form.Item name="email" label="邮箱" rules={[emailValidator()]}>
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoComplete="on"
        />
      </Form.Item>
      <Form.Item name="password" label="密 码" rules={[emptyValidator('密码')]}>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          {loading ? '正在' : ''}登陆
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PasswordForm
