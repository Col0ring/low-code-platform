import React, { useMemo } from 'react'
import { Layout, Row, Col, Breadcrumb, Tabs, Tag, Space } from 'antd'
import { Outlet, useLocation, Link } from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
import './style.less'
import DefaultAppIcon from '@/features/main/components/default-app-icon'
import { getActiveKey } from '@/router'
import NavigationDropdown from '../../components/navigation-dropdown'

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

const AppLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(tabPaths, pathname), [pathname])

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <Row gutter={10}>
          <Col span={7}>
            <div className="app-header-navigation">
              <NavigationDropdown />
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Space>
                    <DefaultAppIcon size={24} />
                    App Name<Tag color="success">已启用</Tag>
                  </Space>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </Col>
          <Col span={10}>
            <div className="app-header-navbar">
              <Tabs activeKey={activeKey}>
                <Tabs.TabPane
                  tab={<Link to={Path.DesignIndex}>页面管理</Link>}
                  key="app"
                />
                <Tabs.TabPane
                  tab={<Link to={Path.DesignSetting}>应用设置</Link>}
                  key="setting"
                />
                <Tabs.TabPane
                  tab={<Link to={Path.DesignPublish}>应用发布</Link>}
                  key="publish"
                />
              </Tabs>
            </div>
          </Col>
          <Col span={7}>
            <div className="app-header-actions">
              <UserActions />
            </div>
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content className="app-main">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default AppLayout
