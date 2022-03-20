import React from 'react'
import classnames from 'classnames'
import useDrag, { UseDragOptions } from '../../../hooks/useDrag'

export interface DraggableProps<T = any> extends UseDragOptions<T> {
  data?: T
  style?: React.CSSProperties
  className?: string
  draggingClassName?: string
}

export const Draggable: React.FC<DraggableProps> = ({
  data,
  children,
  className,
  style,
  draggingClassName,
  ...props
}) => {
  const [getProps, { isDragging }] = useDrag(props)
  const classes = classnames(className, isDragging && draggingClassName)
  return (
    <div {...getProps(data)} style={style} className={classes}>
      {children}
    </div>
  )
}

export default Draggable
