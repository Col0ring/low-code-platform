import React from 'react'
import LazyLoad from '@/components/lazy-load'
import RouteLoading, { RouteLoadingProps } from './route-loading'

export interface LazyRouteProps extends RouteLoadingProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>
}

const LazyRoute: React.FC<LazyRouteProps> = (props) => {
  const { component, loadingFullScreen } = props

  return (
    <LazyLoad fallback={<RouteLoading loadingFullScreen={loadingFullScreen} />}>
      {React.createElement(component)}
    </LazyLoad>
  )
}

export default LazyRoute
