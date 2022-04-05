import React, { useMemo } from 'react'
import { Layout, Row, Col, Breadcrumb, Tabs } from 'antd'

import { Outlet, useLocation, Link } from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
import './style.less'
import { getActiveKey } from '@/router'
import NavigationDropdown from '@/features/app/components/navigation-dropdown'

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

const DesignLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(tabPaths, pathname), [pathname])

  return (
    <Layout className="design-layout">
      <Layout.Header className="design-header">
        <Row gutter={10}>
          <Col span={7}>
            <div className="design-header-navigation">
              <NavigationDropdown />
              <Breadcrumb separator=">">
                <Breadcrumb.Item>App Name</Breadcrumb.Item>
                <Breadcrumb.Item>Page Name</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </Col>
          <Col span={10}>
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
          </Col>
          <Col span={7}>
            <div className="design-header-actions">
              <UserActions />
            </div>
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content className="design-main">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default DesignLayout
