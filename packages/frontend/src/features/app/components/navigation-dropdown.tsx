import { Button, Dropdown, Menu } from 'antd'
import React, { useState } from 'react'
import {
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  GiftOutlined,
} from '@ant-design/icons'
import { Path } from '@/router/constants'
import { Link } from 'react-router-dom'

const DropdownOverlay: React.FC = () => {
  return (
    <Menu selectable={false}>
      <Menu.Item key={Path.Dashboard} icon={<HomeOutlined />}>
        <span className="inline-flex justify-between w-20 items-center">
          <Link to={Path.Dashboard}>首页</Link>
        </span>
      </Menu.Item>
      <Menu.Item key={Path.AppCenter} icon={<UserOutlined />}>
        <Link to={Path.AppCenter}>我的应用</Link>
      </Menu.Item>
      <Menu.Item key={Path.TemplatesCenter} icon={<GiftOutlined />}>
        <Link to={Path.TemplatesCenter}>模 板中心</Link>
      </Menu.Item>
    </Menu>
  )
}

const NavigationDropdown: React.FC = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Dropdown
      arrow
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      overlay={<DropdownOverlay />}
    >
      <Button
        className="mr-3"
        icon={<AppstoreOutlined className="text-lg" />}
        shape="circle"
      />
    </Dropdown>
  )
}

export default NavigationDropdown
