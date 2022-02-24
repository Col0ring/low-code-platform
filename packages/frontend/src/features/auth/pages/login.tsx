import React, { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Tabs } from 'antd'
import { useGetAuthCodeMutation, useLoginMutation } from '../auth.service'
import PasswordForm, { PasswordFormProps } from '../components/password-form'
import CodeForm, { CodeFormProps } from '../components/code-form'

const Login: React.FC = () => {
  const [activeKey, setActiveKey] = useState('password')
  const [login, { data, isLoading }] = useLoginMutation()
  const [getAuthCode] = useGetAuthCodeMutation()
  const [searchParams] = useSearchParams({
    redirect: '',
  })
  const onPasswordLogin: PasswordFormProps['onLogin'] = (phone, password) => {
    void login({ phone, passwordOrCode: password, type: 'password' })
  }
  const onCodeLogin: CodeFormProps['onLogin'] = (phone, code) => {
    void login({ phone, passwordOrCode: code, type: 'code' })
  }

  const onAuthCodeButtonClick: CodeFormProps['onAuthCodeButtonClick'] = (
    phone
  ) => {
    void getAuthCode(phone)
  }

  return (
    <>
      <Tabs centered activeKey={activeKey} size="large" onChange={setActiveKey}>
        <Tabs.TabPane disabled={isLoading} tab="账号密码登录" key="password">
          <PasswordForm onLogin={onPasswordLogin} loading={isLoading} />
        </Tabs.TabPane>
        <Tabs.TabPane disabled={isLoading} tab="验证码登录" key="code">
          <CodeForm
            onAuthCodeButtonClick={onAuthCodeButtonClick}
            onLogin={onCodeLogin}
            loading={isLoading}
          />
        </Tabs.TabPane>
      </Tabs>
      {data && (
        <Navigate replace to={searchParams.get('redirect') || '/dashboard'} />
      )}
    </>
  )
}

export default Login
