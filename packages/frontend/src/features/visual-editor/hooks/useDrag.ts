import { useCallback, useState } from 'react'

interface DragState {
  isDragging: boolean
}

type UseDragReturn<T> = [
  (data: T) => {
    draggable: 'true'
    onDragStart: (e: React.DragEvent) => void
    onDragEnd: (e: React.DragEvent) => void
    onDrag?: (e: React.DragEvent) => void
  },
  DragState
]

interface UseDragOptions<T> {
  onDragStart?: (data: T, e: React.DragEvent) => void
  onDragEnd?: (data: T, e: React.DragEvent) => void
  onDrag?: (data: T, e: React.DragEvent) => void
  customDragData?: Record<PropertyKey, string>
}

function useDrag<T = any>(options?: UseDragOptions<T>): UseDragReturn<T> {
  const [isDragging, setIsDragging] = useState(false)
  const getProps = useCallback(
    (data: T) => {
      return {
        draggable: 'true' as const,
        onDragStart: (e: React.DragEvent) => {
          setIsDragging(true)
          options?.onDragStart?.(data, e)
          // 额外的属性，可以自行获取
          e.dataTransfer.setData('__custom', JSON.stringify(data))
          if (
            options?.customDragData &&
            typeof options.customDragData === 'object'
          ) {
            Object.keys(options.customDragData).forEach((key) => {
              e.dataTransfer.setData(key, options.customDragData![key])
            })
          }
        },
        onDrag: (e: React.DragEvent) => {
          options?.onDrag?.(data, e)
        },
        onDragEnd: (e: React.DragEvent) => {
          setIsDragging(false)
          options?.onDragEnd?.(data, e)
        },
      }
    },
    [options]
  )

  return [getProps, { isDragging }]
}

export type { DragState, UseDragReturn, UseDragOptions }
export default useDrag
