import React from 'react'
import classnames from 'classnames'
import useDrag, { UseDragOptions } from '../../hooks/useDrag'
import { StrictOmit } from 'types-kit'

export interface DraggableProps<T = any>
  extends UseDragOptions<T>,
    StrictOmit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      'onDragStart' | 'onDragEnd' | 'onDrag'
    > {
  draggable?: boolean
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
  draggable = true,
  onDragStart,
  onDragEnd,
  onDrag,
  customDragData,
  ...props
}) => {
  const [getProps, { isDragging }] = useDrag({
    onDragStart,
    onDragEnd,
    onDrag,
    customDragData,
  })
  const classes = classnames(className, isDragging && draggingClassName)
  return (
    <div
      {...props}
      {...getProps(data)}
      style={style}
      className={classes}
      draggable={draggable}
    >
      {children}
    </div>
  )
}

export default Draggable
