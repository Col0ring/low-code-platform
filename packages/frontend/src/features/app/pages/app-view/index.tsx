import { Path } from '@/router/constants'
import RouteLoading from '@/router/route-loading'
import { HttpStatus } from '@/store'
import React, { useRef, useEffect } from 'react'
import { Navigate, useParams } from 'react-router'
import { useGetAppViewQuery } from '../../app.service'
export interface AppViewProps {
  appId?: number
  style?: React.CSSProperties
  className?: string
}
const AppView: React.FC<AppViewProps> = ({
  appId: appIdProp,
  className,
  style,
}) => {
  const { appId: appIdParam } = useParams() as { appId: string }
  const appId = appIdProp || appIdParam
  const ref = useRef<HTMLIFrameElement | null>(null)

  const { data, error, isLoading } = useGetAppViewQuery(+appId)
  useEffect(() => {
    if (ref.current && ref.current.contentWindow && data) {
      ref.current.contentWindow.appViewId = +appId
      ref.current.contentWindow.app = data
    }
  }, [appId, data])
  return isLoading ? (
    <RouteLoading loadingFullScreen />
  ) : error ? (
    (error as any).status === HttpStatus.Forbidden ? (
      <Navigate to={Path.Forbidden} replace />
    ) : null
  ) : (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe ref={ref} style={style} className={className} src="/" />
  )
}

export default AppView
