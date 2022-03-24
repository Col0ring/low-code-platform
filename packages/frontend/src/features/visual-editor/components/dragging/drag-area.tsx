import React, { useEffect } from 'react'
import classnames from 'classnames'
import { usePersistFn } from '@/hooks'
import { noop } from '@/utils'
import useDrop, { DropAreaOptions } from '../../hooks/useDrog'

export interface DragAreaProps extends DropAreaOptions {
  style?: React.CSSProperties
  className?: string
  draggingClassName?: string
  onChange?: (isHovering: boolean) => void
}
export const DragArea: React.FC<DragAreaProps> = ({
  children,
  style,
  className,
  draggingClassName,
  onChange = noop,
  ...props
}) => {
  const [getProps, { isHovering }] = useDrop(props)
  const onPersisChange = usePersistFn(onChange)

  const classes = classnames(className, isHovering && draggingClassName)

  useEffect(() => {
    onPersisChange(isHovering)
  }, [isHovering, onPersisChange])

  return (
    <div style={style} className={classes} {...getProps()}>
      {children}
    </div>
  )
}

export default DragArea
