import React from 'react'
import { Form, Button, Input, FormProps } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { emptyValidator, phoneValidator } from '@/utils/validators'
export interface PasswordFormProps {
  onLogin: (phone: string, password: string) => void
  loading: boolean
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onLogin, loading }) => {
  const onFinish: FormProps['onFinish'] = (values) => {
    const { phone, password } = values
    onLogin(phone, password)
  }
  return (
    <Form
      size="large"
      labelCol={{
        span: 5,
      }}
      initialValues={{
        phone: '13696035481',
        password: '1',
      }}
      onFinish={onFinish}
      className="pt-7"
    >
      <Form.Item name="phone" label="手机号" rules={[phoneValidator()]}>
        <Input
          prefix={<UserOutlined />}
          placeholder="Phone"
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
