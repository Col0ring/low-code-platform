import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Space } from 'antd'
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '@/store/services/auth'
import {
  useGetUserListQuery,
  useLazyGetUserListQuery,
} from '@/store/services/user'
import { Link, Outlet } from 'react-router-dom'

const EditPage: React.FC = () => {
  const [page, setPage] = useState(0)
  const { data, isFetching, isLoading } = useGetUserListQuery(page)
  const [trigger] = useLazyGetUserListQuery()

  const [login] = useLoginMutation()
  const [logout] = useLogoutMutation()
  const [register] = useRegisterMutation()
  const [form] = Form.useForm()
  // useEffect(() => {
  //   setInterval(() => {
  //     setPage((prev) => {
  //       if (prev > 6) {
  //         return prev - 1
  //       }

  //       return prev + 1
  //     })
  //   }, 1000)
  // }, [])
  useEffect(() => {
    void trigger(page, true)
  }, [page, trigger])

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
          console.log(values)
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
      <div>
        <Space>
          <Link to="/auth">auth</Link>

          <Link to="/dashboard">dashboard</Link>
          <Link to="/public">public</Link>
          <Link to="/login">login</Link>
        </Space>
      </div>
      <Outlet />
    </div>
  )
}

export default EditPage
