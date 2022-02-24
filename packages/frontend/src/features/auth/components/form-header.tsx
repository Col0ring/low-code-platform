import React from 'react'
import { Divider } from 'antd'

interface LoginHeaderProps {
  title: string
  className?: string
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, className }) => {
  return <Divider className={className}>{title}</Divider>
}

export default LoginHeader
