import React from 'react'
import classnames from 'classnames'
import { Tooltip } from 'antd'
export interface MenuPaneItemProps {
  isActive: boolean
  icon: React.ReactNode
  title: string
  index: number
  onClick: (options: { index: number; title: string }) => void
}

const MenuPaneItem: React.FC<MenuPaneItemProps> = (props) => {
  const { isActive, onClick: onClickProp, icon, title, index } = props
  const classes = classnames('menu-pane-item', {
    active: isActive,
  })
  const onClick = () => {
    onClickProp({ index, title })
  }
  return (
    <Tooltip placement="right" title={title}>
      <div className={classes} onClick={onClick}>
        {icon}
      </div>
    </Tooltip>
  )
}

export default MenuPaneItem
