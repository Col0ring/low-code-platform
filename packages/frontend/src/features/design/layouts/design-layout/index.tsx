import React, { useMemo } from 'react'
import { Layout, Menu, Breadcrumb, Button, Tabs } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { Outlet, matchPath, useLocation, Link } from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
import { useMatchedRoutes } from '@/hooks'
import './style.less'

const tabPaths = [
  {
    path: Path.DesignIndex,
    key: 'design',
  },
  {
    path: Path.DesignSetting,
    key: 'setting',
  },
  {
    path: Path.DesignPublish,
    key: 'publish',
  },
]

function getActiveKey(pathname: string) {
  return (
    tabPaths.find(({ path }) =>
      matchPath(
        {
          path,
        },
        pathname
      )
    )?.key || ''
  )
}

const DesignLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(pathname), [pathname])
  const matchedRoutes = useMatchedRoutes()
  console.log(matchedRoutes)
  return (
    <Layout className="design-layout">
      <Layout.Header className="design-header">
        <div className="design-header-navigation">
          <Button
            className="mr-3"
            icon={<AppstoreOutlined className="text-lg" />}
            shape="circle"
          />
          <Breadcrumb separator=">">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="design-header-navbar">
          <Tabs activeKey={activeKey}>
            <Tabs.TabPane
              tab={<Link to={Path.DesignIndex}>页面设计</Link>}
              key="design"
            />
            <Tabs.TabPane
              tab={<Link to={Path.DesignSetting}>页面设置</Link>}
              key="setting"
            />
            <Tabs.TabPane
              tab={<Link to={Path.DesignPublish}>页面发布</Link>}
              key="publish"
            />
          </Tabs>
        </div>
        <div className="design-header-actions">
          <div className="mr-3">
            <Button className="mr-1">预览</Button>
            <Button type="primary">保存</Button>
          </div>
          <UserActions />
        </div>
      </Layout.Header>
      <Layout.Content className="design-main">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default DesignLayout
