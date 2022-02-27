import React from 'react'
import { useSearchParams, Navigate, Link } from 'react-router-dom'
import { Tabs } from 'antd'
import { useRegisterMutation } from '../auth.service'
import RegisterForm from '../components/register-form'
import { Path } from '@/router/constants'

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams({
    redirect: '',
  })
  const [register, { isSuccess, isLoading }] = useRegisterMutation()

  return (
    <>
      <Tabs centered activeKey="register" animated={false} size="large">
        <Tabs.TabPane tab="注册" key="register">
          <RegisterForm loading={isLoading} onRegister={register} />
        </Tabs.TabPane>
      </Tabs>
      <div className="flex justify-end pb-4">
        <span className="text-gray-500">已有账号，</span>
        <Link to={Path.Login}>去登录</Link>
      </div>
      {isSuccess && (
        <Navigate replace to={searchParams.get('redirect') || '/dashboard'} />
      )}
    </>
  )
}

export default RegisterPage
