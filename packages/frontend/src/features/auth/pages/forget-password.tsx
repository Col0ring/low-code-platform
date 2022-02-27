import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Tabs } from 'antd'
import { Path } from '@/router/constants'
import {
  useGetAuthCodeMutation,
  useResetPasswordMutation,
} from '../auth.service'
import ResetPasswordForm, {
  ResetPasswordFormProps,
} from '../components/reset-password-form'

const ForgetPasswordPage: React.FC = () => {
  const [getAuthCode] = useGetAuthCodeMutation()
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()

  const onAuthCodeButtonClick: ResetPasswordFormProps['onAuthCodeButtonClick'] =
    (phone) => {
      void getAuthCode(phone)
    }

  return (
    <>
      <Tabs centered activeKey="reset-password" animated={false} size="large">
        <Tabs.TabPane tab="重置密码" key="reset-password">
          <ResetPasswordForm
            loading={isLoading}
            onResetPassword={resetPassword}
            onAuthCodeButtonClick={onAuthCodeButtonClick}
          />
        </Tabs.TabPane>
      </Tabs>
      <div className="flex justify-between pb-4">
        <Link to={Path.Register}>去注册</Link>
        <span>
          <span className="text-gray-500">已有账号，</span>
          <Link to={Path.Login}>去登录</Link>
        </span>
      </div>
      {isSuccess && <Navigate to={Path.Login} />}
    </>
  )
}

export default ForgetPasswordPage
