import React, { useRef, useEffect } from 'react'
import { useParams } from 'react-router'
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
  useEffect(() => {
    if (ref.current && ref.current.contentWindow) {
      ref.current.contentWindow.appViewId = +appId
    }
  }, [appId])
  return (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe ref={ref} style={style} className={className} src="/" />
  )
}

export default AppView
