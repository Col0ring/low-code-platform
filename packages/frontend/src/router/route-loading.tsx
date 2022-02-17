import React from 'react'
import { Spin } from 'antd'
export interface RouteLoadingProps {
  loadingFullScreen?: boolean
}
const RouteLoading: React.FC<RouteLoadingProps> = (props) => {
  const { loadingFullScreen } = props
  return (
    <Spin
      spinning
      style={{
        width: '100%',
        height: loadingFullScreen ? '100vh' : '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

export default RouteLoading
