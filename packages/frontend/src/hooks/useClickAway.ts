import { RefObject, useEffect, useRef } from 'react'

type EventType = MouseEvent | TouchEvent

const defaultEvents: (keyof HTMLElementEventMap)[] = ['click']

function useClickAway<E extends EventType = EventType>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: (keyof HTMLElementEventMap)[] = defaultEvents
) {
  const savedCallback = useRef(onClickAway)
  savedCallback.current = onClickAway

  useEffect(() => {
    const handler: EventListener = (event) => {
      const { current: el } = ref
      // 执行回调
      el &&
        !el.contains(event.target as Node) &&
        savedCallback.current(event as E)
    }
    for (const eventName of events) {
      document.addEventListener(eventName, handler)
    }
    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler)
      }
    }
  }, [events, ref])
}
export type { EventType }
export default useClickAway
