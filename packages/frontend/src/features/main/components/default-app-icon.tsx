import React from 'react'
import { AppstoreOutlined } from '@ant-design/icons'
export interface DefaultAppIconProps {
  size: number
}
const DefaultAppIcon: React.FC<DefaultAppIconProps> = ({ size }) => {
  return (
    <AppstoreOutlined
      style={{ height: size, width: size, fontSize: size * 0.7, lineHeight: 1 }}
      className="bg-blue-400 rounded-md w-44px flex-shrink-0 h-44px flex items-center justify-center text-white"
    />
  )
}

export default DefaultAppIcon
