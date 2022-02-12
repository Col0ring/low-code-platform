import { Spin } from 'antd'
import React from 'react'
import LazyLoad from '@/components/lazy-load'

export interface LazyRouteProps {
  render: () => Promise<{
    default: React.FC<{}>
  }>
  loadingFullScreen?: boolean
}

export const LazyRoute: React.FC<LazyRouteProps> = (props) => {
  const { render, loadingFullScreen } = props
  return (
    <LazyLoad
      fallback={
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
      }
    >
      {React.createElement(React.lazy(render))}
    </LazyLoad>
  )
}
