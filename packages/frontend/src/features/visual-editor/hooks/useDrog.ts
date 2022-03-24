import { useState, useRef, useCallback } from 'react'
import useMountedState from '@/hooks/useMountedState'

interface DropAreaState {
  isHovering: boolean
}

interface DropProps {
  onDragOver: React.DragEventHandler
  onDragEnter: React.DragEventHandler
  onDragLeave: React.DragEventHandler
  onDrop: React.DragEventHandler
  onPaste: React.ClipboardEventHandler
}

interface DropAreaOptions extends Partial<DropProps> {
  onFiles?: (files: File[], event?: React.DragEvent) => void
  onUri?: (url: string, event?: React.DragEvent) => void
  // 自定义 dom 节点
  onDom?: (content: any, event?: React.DragEvent) => void
  onText?: (text: string, event?: React.ClipboardEvent) => void
}

type DropCallback = (
  dataTransfer: DataTransfer,
  event: React.DragEvent | React.ClipboardEvent
) => void

type UseDropReturn = [() => DropProps, DropAreaState]

function useDrop(options: DropAreaOptions = {}): UseDropReturn {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const [isHovering, setIsHovering] = useState(false)

  const getProps = useCallback(
    (callback: DropCallback): DropProps => {
      return {
        onDragOver: (event) => {
          event.preventDefault()
          optionsRef.current.onDragOver?.(event)
        },
        onDragEnter: (event) => {
          event.preventDefault()
          setIsHovering(true)
          optionsRef.current.onDragEnter?.(event)
        },
        onDragLeave: (event) => {
          event.preventDefault()
          setIsHovering(false)
          optionsRef.current.onDragLeave?.(event)
        },
        onDrop: (event) => {
          event.preventDefault()
          event.persist()
          setIsHovering(false)
          optionsRef.current.onDrop?.(event)
          callback(event.dataTransfer, event)
        },
        onPaste: (event) => {
          event.persist()
          optionsRef.current.onPaste?.(event)
          callback(event.clipboardData, event)
        },
      }
    },
    [setIsHovering]
  )

  const isMounted = useMountedState()
  const callback: DropCallback = useCallback(
    (dataTransfer, event) => {
      // uri
      const uri = dataTransfer.getData('text/uri-list')
      const dom = dataTransfer.getData('__custom')

      // 自定义属性
      if (dom && optionsRef.current.onDom) {
        let data = dom
        try {
          data = JSON.parse(dom)
        } catch (e) {
          data = dom
        }
        optionsRef.current.onDom(data, event as React.DragEvent)
        return
      }

      // 链接
      if (uri && optionsRef.current.onUri) {
        optionsRef.current.onUri(uri, event as React.DragEvent)
        return
      }

      // 文件
      if (
        dataTransfer.files &&
        dataTransfer.files.length &&
        optionsRef.current.onFiles
      ) {
        optionsRef.current.onFiles(
          Array.from(dataTransfer.files),
          event as React.DragEvent
        )
        return
      }

      // 文字
      if (
        dataTransfer.items &&
        dataTransfer.items.length &&
        optionsRef.current.onText
      ) {
        // 拿到 text
        dataTransfer.items[0].getAsString((text) => {
          isMounted() &&
            optionsRef.current.onText!(text, event as React.ClipboardEvent)
        })
      }
    },
    [isMounted]
  )

  const wrapperGetProps = useCallback(
    () => getProps(callback),
    [callback, getProps]
  )

  return [wrapperGetProps, { isHovering }]
}

export type {
  DropAreaOptions,
  DropAreaState,
  DropProps,
  DropCallback,
  UseDropReturn,
}

export default useDrop
