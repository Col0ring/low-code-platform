import React, { useState } from 'react'
import { Avatar, Dropdown, Badge, Space, Menu, Modal } from 'antd'
import {
  DownOutlined,
  BellOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useLogoutMutation } from '../../auth.service'
import './style.less'

const UserActionsDropdown: React.FC = () => {
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  const { isAdmin } = useAuth()

  const onLogoutButtonClick = () => {
    Modal.confirm({
      title: '提示',
      content: '确认退出登录吗？',
      async onOk() {
        await logout()
      },
    })
  }

  return (
    <Menu selectable={false}>
      {isAdmin && (
        <>
          <Menu.Item
            icon={<HomeOutlined />}
            onClick={() => {
              navigate('/')
            }}
          >
            回到首页
          </Menu.Item>
          <Menu.Item
            icon={<DashboardOutlined />}
            onClick={() => {
              navigate('/admin')
            }}
          >
            管理平台
          </Menu.Item>
        </>
      )}
      <Menu.Item icon={<LogoutOutlined />} onClick={onLogoutButtonClick}>
        退出登陆
      </Menu.Item>
    </Menu>
  )
}

const UserActions: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { user } = useAuth()
  const classes = classnames('avatar-dropdown-icon', {
    open: visible,
  })
  return (
    <div className="user-actions">
      <div className="action-tools">
        <Space size="middle">
          <Badge dot>
            <BellOutlined />
          </Badge>
        </Space>
      </div>
      <Dropdown
        visible={visible}
        arrow
        overlay={<UserActionsDropdown />}
        onVisibleChange={setVisible}
      >
        <div className="avatar-container">
          <Avatar src={user?.avatar} size="large" alt={user?.username} />
          <DownOutlined className={classes} />
        </div>
      </Dropdown>
    </div>
  )
}

export default UserActions
