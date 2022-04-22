import React, { useMemo } from 'react'
import { Affix, Layout, Menu } from 'antd'
import UserActions from '@/features/auth/components/user-actions'
import { Outlet, useLocation, Link } from 'react-router-dom'
import './style.less'
import logo from '@/features/main/assets/logo.svg'
import { Path } from '@/router/constants'
import { getActiveKey } from '@/router'

const tabPaths = [
  {
    path: Path.Dashboard,
    key: Path.Dashboard,
  },
  {
    path: Path.AppCenter,
    key: Path.AppCenter,
  },
  {
    path: Path.TemplatesCenter,
    key: Path.TemplatesCenter,
  },
  {
    path: Path.UserCenter,
    key: Path.UserCenter,
  },
]
const MainLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(tabPaths, pathname), [pathname])
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
          <div className="float-right h-full">
            <UserActions />
          </div>
          <div className="menu-tabs-container">
            <Menu
              className="menu-tabs"
              mode="horizontal"
              selectedKeys={[activeKey]}
            >
              {/* <Menu.Item key={Path.Dashboard}>
                <Link to={Path.Dashboard}> 开始</Link>
              </Menu.Item> */}
              <Menu.Item key={Path.AppCenter}>
                <Link to={Path.AppCenter}>我的应用</Link>
              </Menu.Item>
              <Menu.Item key={Path.TemplatesCenter}>
                <Link to={Path.TemplatesCenter}>模板中心</Link>
              </Menu.Item>
              <Menu.Item key={Path.UserCenter}>
                <Link to={Path.UserCenter}>个人中心</Link>
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
