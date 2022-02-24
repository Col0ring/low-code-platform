import React from 'react'
import { Button } from 'antd'
import './style.less'
import { useLogoutMutation } from '@/features/auth/auth.service'
import { useAppSelector } from '@/store'
import { Link } from 'react-router-dom'

const EditorPage: React.FC = () => {
  const [logout] = useLogoutMutation()
  const auth = useAppSelector((state) => state.auth)
  // console.log(auth)
  return (
    <div className="visual-editor">
      11
      <Link to="/auth">Auth</Link>
      <Button onClick={() => logout()}>登出</Button>
    </div>
  )
}

export default EditorPage
