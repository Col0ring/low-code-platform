import React from 'react'
import { Form, FormProps, Button, Input } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'
import {
  emailValidator,
  emptyValidator,
  phoneValidator,
} from '@/utils/validators'

export interface RegisterFormProps {
  onRegister: (values: any) => void
  loading?: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading }) => {
  const [form] = Form.useForm()
  const onFinish: FormProps['onFinish'] = (values) => {
    onRegister(values)
    form.resetFields()
  }
  return (
    <Form
      form={form}
      labelCol={{
        span: 5,
      }}
      className="pt-7 pb-5"
      onFinish={onFinish}
    >
      <Form.Item name="phone" label="手机号" rules={[phoneValidator()]}>
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Phone"
          autoComplete="phone"
        />
      </Form.Item>
      <Form.Item name="name" label="用户名" rules={[emptyValidator('用户名')]}>
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          autoComplete="username"
        />
      </Form.Item>
      <Form.Item name="email" label="邮 箱" rules={[emailValidator()]}>
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoComplete="email"
        />
      </Form.Item>
      <Form.Item name="password" label="密 码" rules={[emptyValidator('密码')]}>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>
      <Form.Item
        name="rePassword"
        label="确认密码"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject('两次密码输入不一致')
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="re-password"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          {loading ? '正在' : ''}注册
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm
