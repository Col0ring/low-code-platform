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
import ImageUploader from '@/features/upload/components/image-uploader'

export interface RegisterFormProps {
  onRegister: (values: any) => void
  loading: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading }) => {
  const onFinish: FormProps['onFinish'] = (values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rePassword, ...rest } = values
    onRegister(rest)
  }
  return (
    <Form
      labelCol={{
        span: 5,
      }}
      className="pt-7"
      onFinish={onFinish}
    >
      <Form.Item name="email" label="邮 箱" rules={[emailValidator()]}>
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoComplete="email"
        />
      </Form.Item>

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
      <Form.Item name="phone" label="手机号" rules={[phoneValidator()]}>
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Phone"
          autoComplete="phone"
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
              if (getFieldValue('password') === value) {
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
