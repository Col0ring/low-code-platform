import React from 'react'
import classnames from 'classnames'
import { Spin } from 'antd'
export interface RouteLoadingProps {
  loadingFullScreen?: boolean
}
const RouteLoading: React.FC<RouteLoadingProps> = (props) => {
  const { loadingFullScreen } = props
  const classes = classnames(
    'w-full flex justify-center items-center flex-1',
    loadingFullScreen ? 'h-screen' : 'h-full'
  )
  return <Spin spinning className={classes} />
}

export default RouteLoading
