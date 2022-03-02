import React from 'react'
import { Card, Space } from 'antd'
import {
  CloseCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from '@ant-design/icons'
import classnames from 'classnames'

export interface MenuContentProps {
  title: string
  fixed: boolean
  onFixedButtonClick: (fixed: boolean) => void
  onCloseButtonClick: () => void
}
const MenuContent: React.FC<MenuContentProps> = (props) => {
  const {
    fixed,
    title,
    children,
    onFixedButtonClick: onFixedButtonClickProp,
    onCloseButtonClick,
  } = props
  const classes = classnames('menu-content', {
    'fixed-active': fixed,
  })
  const onFixedButtonClick = () => {
    onFixedButtonClickProp(!fixed)
  }
  return (
    <div className={classes}>
      <Card
        title={title}
        extra={
          <Space>
            {React.createElement(fixed ? DisconnectOutlined : LinkOutlined, {
              onClick: onFixedButtonClick,
            })}
            <CloseCircleOutlined onClick={onCloseButtonClick} />
          </Space>
        }
        className="h-full"
      >
        {children}
      </Card>
    </div>
  )
}

export default MenuContent
