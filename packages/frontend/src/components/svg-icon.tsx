import classnames from 'classnames'
import React, { useMemo } from 'react'

export interface SvgIconProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  raw: string
}

const SvgIcon: React.FC<SvgIconProps> = ({ raw, className, ...props }) => {
  const classes = useMemo(
    () =>
      classnames(className, 'anticon', {
        'cursor-pointer': !!props.onClick,
      }),
    [className, props.onClick]
  )
  return (
    <span
      {...props}
      role="img"
      className={classes}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}

export default SvgIcon
