import React from 'react'
import { Affix, Layout, Menu } from 'antd'
import UserActions from '@/features/auth/components/user-actions'
import { Outlet, useLocation, Link } from 'react-router-dom'
import './style.less'
import logo from '@/features/app/assets/logo.svg'
import { Path } from '@/router/constants'

const MainLayout: React.FC = () => {
  const { pathname } = useLocation()
  return (
    <Layout className="main-layout">
      <Affix>
        <Layout.Header className="main-layout-header">
          <h1 className="h-full py-2 float-left">
            <Link className="flex h-full items-center" to={Path.Dashboard}>
              <img src={logo} className="h-full" alt="low-code-platform" />
              <span className="text-gray-700 ml-2">Low-Code-Platform</span>
            </Link>
          </h1>
          <div className="float-right">
            <UserActions />
          </div>
          <div className="menu-tabs-container">
            <Menu
              className="menu-tabs"
              mode="horizontal"
              selectedKeys={[pathname]}
            >
              <Menu.Item key={Path.Dashboard}>
                <Link to={Path.Dashboard}> 开始</Link>
              </Menu.Item>
              <Menu.Item key={Path.AppCenter}>
                <Link to={Path.AppCenter}>我的应用</Link>
              </Menu.Item>
              <Menu.Item key={Path.TemplatesCenter}>
                <Link to={Path.TemplatesCenter}>模板中心</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Layout.Header>
      </Affix>
      <Layout.Content className="flex flex-col">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default MainLayout
