import React, { useState } from 'react'
import { Image } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
export interface DefaultAppIconProps {
  size: number
  src?: string
}
const DefaultAppIcon: React.FC<DefaultAppIconProps> = ({ size, src }) => {
  const [hasError, setHasError] = useState(false)
  return !src || hasError ? (
    <AppstoreOutlined
      className="bg-blue-400 rounded-md w-44px flex-shrink-0 h-44px inline-flex items-center justify-center text-white"
      style={{
        height: size,
        width: size,
        fontSize: size * 0.7,
        lineHeight: 1,
      }}
    />
  ) : (
    <Image
      src={src}
      preview={false}
      onError={() => setHasError(true)}
      style={{
        height: size,
        width: size,
        fontSize: size * 0.7,
        lineHeight: 1,
      }}
      className="rounded-md w-44px flex-shrink-0 h-44px inline-flex items-center justify-center text-white"
    />
  )
}

export default DefaultAppIcon
