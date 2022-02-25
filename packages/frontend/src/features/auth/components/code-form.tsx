import React, { useState, useEffect } from 'react'
import { Form, FormProps, Button, Input, Col, Row } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { phoneValidator, normalValidator } from '@/utils/validators'

export interface CodeFormProps {
  onLogin: (phone: string, code: string) => void
  onAuthCodeButtonClick: (phone: string) => void
  loading?: boolean
}

const CodeForm: React.FC<CodeFormProps> = ({
  onLogin,
  loading,
  onAuthCodeButtonClick: onAuthCodeButtonClickProp,
}) => {
  const [authTime, setAuthTime] = useState(0)
  const [form] = Form.useForm()
  const onAuthCodeButtonClick = async () => {
    if (authTime) return
    await form.validateFields(['phone'])
    onAuthCodeButtonClickProp(form.getFieldValue('phone'))
    setAuthTime(60)
  }
  const onFinish: FormProps['onFinish'] = (values) => {
    const { phone, code } = values
    onLogin(phone, code)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (authTime > 0) {
      timer = setTimeout(() => {
        setAuthTime((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [authTime])
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
      className="pt-7 pb-5"
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
            <Button
              disabled={authTime > 0}
              block
              className="w-9/10 px-1"
              type="primary"
              onClick={onAuthCodeButtonClick}
            >
              <div className="text-cut">
                {authTime ? `${authTime}s 后重新获取` : '获取验证码'}
              </div>
            </Button>
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
