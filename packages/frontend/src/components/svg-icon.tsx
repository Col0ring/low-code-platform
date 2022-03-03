import React from 'react'

export interface SvgIconProps {
  raw: string
}

const SvgIcon: React.FC<SvgIconProps> = ({ raw }) => {
  return (
    <span
      role="img"
      className="anticon"
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}

export default SvgIcon
