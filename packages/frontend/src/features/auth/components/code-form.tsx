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
  const [submitDisabled, setSubmitDisabled] = useState(true)
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

  const onFieldsChange: FormProps['onFieldsChange'] = (currents) => {
    const current = currents[0]
    if (current && current.name.toString() === 'code') {
      if (current.value.length === 4) {
        setSubmitDisabled(false)
      } else {
        setSubmitDisabled(true)
      }
    }
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
      onFieldsChange={onFieldsChange}
      style={{ padding: '30px 0 20px' }}
    >
      <Form.Item name="phone" label="手机号" rules={[phoneValidator()]}>
        <Input
          prefix={<span style={{ color: '#aaa' }}>+86</span>}
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
          <Col
            span={12}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              disabled={authTime > 0}
              block
              style={{ width: '90%', paddingLeft: 5, paddingRight: 5 }}
              type="primary"
              onClick={onAuthCodeButtonClick}
            >
              {authTime ? `${authTime}s 后重新获取` : '获取验证码'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item>
        <Button
          style={{ width: '100%' }}
          type="primary"
          disabled={submitDisabled}
          htmlType="submit"
          loading={loading}
        >
          {loading ? '正在' : ''}登陆
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CodeForm
