import React from 'react'
import { Form, FormProps, Button, Input, Col, Row } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { phoneValidator, normalValidator } from '@/utils/validators'
import AuthCodeButton from './auth-code-button'

export interface CodeFormProps {
  onLogin: (phone: string, code: string) => void
  onAuthCodeButtonClick: (phone: string) => void
  loading: boolean
}

const CodeForm: React.FC<CodeFormProps> = ({
  onLogin,
  loading,
  onAuthCodeButtonClick: onAuthCodeButtonClickProp,
}) => {
  const [form] = Form.useForm()
  const onAuthCodeButtonClick = async () => {
    try {
      await form.validateFields(['phone'])
      onAuthCodeButtonClickProp(form.getFieldValue('phone'))
    } catch (error) {
      return Promise.reject()
    }
  }
  const onFinish: FormProps['onFinish'] = (values) => {
    const { phone, code } = values
    onLogin(phone, code)
  }

  return (
    <Form
      size="large"
      form={form}
      initialValues={{
        phone: '13696035481',
      }}
      labelCol={{
        span: 5,
      }}
      onFinish={onFinish}
      className="pt-7"
    >
      <Form.Item name="phone" label="手机号" rules={[phoneValidator()]}>
        <Input
          prefix={<span className="text-gray-400">+86</span>}
          placeholder="Phone"
          autoComplete="on"
        />
      </Form.Item>
      <Form.Item label="验证码">
        <Row align="middle" justify="space-between">
          <Col span={12}>
            <Form.Item
              noStyle
              name="code"
              rules={[
                normalValidator('请输入4位验证码', {
                  len: 4,
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
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          {loading ? '正在' : ''}登陆
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CodeForm