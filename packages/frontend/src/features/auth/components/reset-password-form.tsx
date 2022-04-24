import React from 'react'
import { Form, FormProps, Button, Input, Row, Col } from 'antd'
import { StarOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import {
  emailValidator,
  emptyValidator,
  normalValidator,
} from '@/utils/validators'
import AuthCodeButton from './auth-code-button'

export interface ResetPasswordFormProps {
  onResetPassword: (values: any) => void
  onAuthCodeButtonClick: (email: string) => void
  loading: boolean
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  onAuthCodeButtonClick: onAuthCodeButtonClickProp,
  loading,
}) => {
  const [form] = Form.useForm()
  const onFinish: FormProps['onFinish'] = (values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rePassword, ...rest } = values
    onResetPassword(rest)
  }
  const onAuthCodeButtonClick = async () => {
    try {
      await form.validateFields(['email'])
      onAuthCodeButtonClickProp(form.getFieldValue('email'))
    } catch (error) {
      return Promise.reject()
    }
  }
  return (
    <Form
      form={form}
      labelCol={{
        span: 5,
      }}
      className="pt-7"
      onFinish={onFinish}
    >
      <Form.Item name="email" label="邮箱" rules={[emailValidator()]}>
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoComplete="email"
        />
      </Form.Item>
      <Form.Item label="验证码">
        <Row align="middle" justify="space-between">
          <Col span={12}>
            <Form.Item
              noStyle
              name="code"
              rules={[
                normalValidator('请输入6位验证码', {
                  len: 6,
                }),
              ]}
            >
              <Input
                prefix={<StarOutlined />}
                placeholder="AuthCode"
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12} className="flex justify-end">
            <div className="w-9/10 px-1">
              <AuthCodeButton onAuthCodeButtonClick={onAuthCodeButtonClick} />
            </div>
          </Col>
        </Row>
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
          {loading ? '正在' : ''}重置密码
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ResetPasswordForm
