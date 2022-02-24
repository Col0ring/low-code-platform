import React, { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
// eslint-disable-next-line import/default
import ParticlesBg from 'particles-bg'
import { Tabs } from 'antd'
import { useGetAuthCodeMutation, useLoginMutation } from '../../auth.service'
import FormHeader from '../../components/form-header'
import PasswordForm, { PasswordFormProps } from '../../components/password-form'
import CodeForm, { CodeFormProps } from '../../components/code-form'
import './style.less'

const Login: React.FC = () => {
  const [activeKey, setActiveKey] = useState('login')
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
    <div className="login-page">
      <div className="login-container">
        <FormHeader title="Low-Code-Platform" className="login-header" />
        <Tabs
          centered
          activeKey={activeKey}
          size="large"
          onChange={setActiveKey}
        >
          <Tabs.TabPane disabled={isLoading} tab="账号密码登录" key="login">
            <PasswordForm onLogin={onPasswordLogin} loading={isLoading} />
          </Tabs.TabPane>
          <Tabs.TabPane disabled={isLoading} tab="验证码登录" key="register">
            <CodeForm
              onAuthCodeButtonClick={onAuthCodeButtonClick}
              onLogin={onCodeLogin}
              loading={isLoading}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <ParticlesBg bg type="cobweb" />
      {data && (
        <Navigate replace to={searchParams.get('redirect') || '/dashboard'} />
      )}
    </div>
  )
}

export default Login
