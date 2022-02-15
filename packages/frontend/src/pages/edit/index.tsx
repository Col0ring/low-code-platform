import React, { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import {
  useGetUserInfoQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '@/store/services/auth'
import { useLazyGetUserListQuery } from '@/store/services/user'

const EditPage: React.FC = () => {
  useGetUserInfoQuery()
  const [trigger, { data }] = useLazyGetUserListQuery()
  const [login] = useLoginMutation()
  const [logout] = useLogoutMutation()
  const [register] = useRegisterMutation()
  const [form] = Form.useForm()
  useEffect(() => {
    setTimeout(() => {
      void trigger()
    }, 1000)
  }, [trigger])

  return (
    <div>
      <Form form={form}>
        <Form.Item label="phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="password" name="password">
          <Input />
        </Form.Item>
      </Form>
      <Button
        onClick={() => {
          const values = form.getFieldsValue()
          void login(values)
        }}
      >
        登录
      </Button>
      <Button
        onClick={() => {
          const values = form.getFieldsValue()
          void register(values)
        }}
      >
        注册
      </Button>
      <Button
        onClick={() => {
          const values = form.getFieldsValue()
          void logout(values)
        }}
      >
        登出
      </Button>
    </div>
  )
}

export default EditPage
