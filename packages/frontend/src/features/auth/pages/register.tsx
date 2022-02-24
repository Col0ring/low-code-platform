import React from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Tabs } from 'antd'
import { useGetAuthCodeMutation, useLoginMutation } from '../auth.service'
import RegisterForm from '../components/register-form'

const RegisterPage: React.FC = () => {
  const [login, { data, isLoading }] = useLoginMutation()
  const [getAuthCode] = useGetAuthCodeMutation()
  const [searchParams] = useSearchParams({
    redirect: '',
  })
  const onRegister = () => {
    //
  }
  return (
    <>
      <Tabs centered activeKey="register" size="large">
        <Tabs.TabPane tab="注册" key="register">
          <RegisterForm onRegister={onRegister} />
        </Tabs.TabPane>
      </Tabs>
      {data && (
        <Navigate replace to={searchParams.get('redirect') || '/dashboard'} />
      )}
    </>
  )
}

export default RegisterPage
