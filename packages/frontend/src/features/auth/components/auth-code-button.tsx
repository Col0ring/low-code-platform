import React, { useState, useEffect } from 'react'
import { Button } from 'antd'

export interface AuthCodeButtonProps {
  onAuthCodeButtonClick: () => Promise<void>
}
const AuthCodeButton: React.FC<AuthCodeButtonProps> = ({
  onAuthCodeButtonClick: onAuthCodeButtonClickProp,
}) => {
  const [authTime, setAuthTime] = useState(0)
  const onAuthCodeButtonClick = async () => {
    try {
      if (authTime) return
      await onAuthCodeButtonClickProp()
      setAuthTime(60)
    } catch (error) {
      //
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
    <Button
      disabled={authTime > 0}
      block
      type="primary"
      onClick={onAuthCodeButtonClick}
    >
      <div className="text-cut">
        {authTime ? `${authTime}s 后重新获取` : '获取验证码'}
      </div>
    </Button>
  )
}

export default AuthCodeButton
