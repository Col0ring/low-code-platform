import { PageRenderNode } from '@/features/visual-editor/type'
import { useClassName } from '@/hooks'
import RouteLoading from '@/router/route-loading'
import React, { useEffect, useRef, useState } from 'react'
export interface PageViewProps {
  page: PageRenderNode
  appId?: number
  style?: React.CSSProperties
  className?: string
}
const PageView: React.FC<PageViewProps> = ({ className, style, page }) => {
  const [load, setLoad] = useState(false)
  const ref = useRef<HTMLIFrameElement | null>(null)
  useEffect(() => {
    if (ref.current && ref.current.contentWindow) {
      ref.current.contentWindow.page = page
      ref.current.contentWindow.postMessage(page)
    }
  }, [page])
  const classes = useClassName([className, 'w-full h-full'], [className])
  return (
    <div className="relative w-full h-full">
      {!load && <RouteLoading className="w-full h-full absolute" />}
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        ref={ref}
        onLoad={() => {
          setLoad(true)
        }}
        style={style}
        className={classes}
        src="/page-view"
      />
    </div>
  )
}

export default PageView
