import { DomParam, getDomElement } from '@/utils'
import { useLayoutEffect, useRef } from 'react'

// sync import
void (async () => {
  if (!window.ResizeObserver) {
    window.ResizeObserver = (await import('resize-observer-polyfill')).default
  }
})()

// react-use 有一个使用 iframe 的 hack 版本
export function useResize<T extends Element>(
  ref: DomParam<T>,
  handler: (
    el: T,
    ...args: Parameters<ResizeObserverCallback>
  ) => ReturnType<ResizeObserverCallback>
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useLayoutEffect(() => {
    const el = getDomElement(ref)
    if (!el) {
      return
    }

    const resizeObserver = new ResizeObserver((...args) =>
      handlerRef.current(el, ...args)
    )

    resizeObserver.observe(el)
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])
}

export default useResize
