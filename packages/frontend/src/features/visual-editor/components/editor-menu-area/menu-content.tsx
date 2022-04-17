import React from 'react'
import { Card, Space } from 'antd'
import {
  CloseCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from '@ant-design/icons'
import classnames from 'classnames'

export interface MenuContentProps {
  className?: string
  title: React.ReactNode
  fixed: boolean
  onFixedButtonClick: (fixed: boolean) => void
  onCloseButtonClick: () => void
}
const MenuContent: React.FC<MenuContentProps> = (props) => {
  const {
    fixed,
    title,
    className,
    children,
    onFixedButtonClick: onFixedButtonClickProp,
    onCloseButtonClick,
  } = props
  const classes = classnames(className, 'menu-content', {
    'fixed-active': fixed,
  })
  const onFixedButtonClick = () => {
    onFixedButtonClickProp(!fixed)
  }
  return (
    <div className={classes}>
      <Card
        title={title}
        bodyStyle={{
          padding: 0,
          flex: 1,
          height: 0,
        }}
        extra={
          <Space>
            {React.createElement(fixed ? DisconnectOutlined : LinkOutlined, {
              onClick: onFixedButtonClick,
            })}
            <CloseCircleOutlined onClick={onCloseButtonClick} />
          </Space>
        }
        className="h-full flex flex-col"
      >
        {children}
      </Card>
    </div>
  )
}

export default MenuContent
