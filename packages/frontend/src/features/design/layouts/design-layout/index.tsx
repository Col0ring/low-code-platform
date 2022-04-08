import React, { useMemo } from 'react'
import { Layout, Row, Col, Breadcrumb, Tabs, Space } from 'antd'

import {
  Outlet,
  useLocation,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
import './style.less'
import { getActiveKey } from '@/router'
import NavigationDropdown from '@/features/app/components/navigation-dropdown'
import { useGetPageDetailQuery } from '@/features/app/app.service'
import RouteLoading from '@/router/route-loading'
import DefaultAppIcon from '@/features/main/components/default-app-icon'

const DesignLayout: React.FC = () => {
  const { appId, pageId } = useParams() as { appId: string; pageId: string }
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data, isFetching } = useGetPageDetailQuery({
    appId: +appId,
    pageId: +pageId,
  })
  const pageIndexPath = useMemo(() => Path.AppPage(appId), [appId])
  const tabs = useMemo(
    () => [
      {
        path: Path.DesignIndex(appId, pageId),
        key: 'design',
        title: '页面设计',
      },
      {
        path: Path.DesignSetting(appId, pageId),
        key: 'setting',
        title: '页面设置',
      },
      {
        path: Path.DesignPublish(appId, pageId),
        key: 'publish',
        title: '页面发布',
      },
    ],
    [appId, pageId]
  )
  const activeKey = useMemo(
    () => getActiveKey(tabs, pathname),
    [pathname, tabs]
  )

  return isFetching ? (
    <RouteLoading loadingFullScreen />
  ) : data ? (
    <Layout className="design-layout">
      <Layout.Header className="design-header">
        <Row gutter={10}>
          <Col span={7}>
            <div className="design-header-navigation">
              <NavigationDropdown />
              <Breadcrumb separator=">">
                <Breadcrumb.Item
                  onClick={() => navigate(Path.AppPage(appId))}
                  className="cursor-pointer"
                >
                  <Space>
                    <DefaultAppIcon size={24} />
                    {data.app.name}
                  </Space>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{data.name}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </Col>
          <Col span={10}>
            <div className="design-header-navbar">
              <Tabs activeKey={activeKey}>
                {tabs.map((tab) => (
                  <Tabs.TabPane
                    tab={<Link to={tab.path}>{tab.title}</Link>}
                    key={tab.key}
                  />
                ))}
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
        <Outlet context={data} />
      </Layout.Content>
    </Layout>
  ) : (
    <Navigate to={pageIndexPath} replace />
  )
}

export default DesignLayout
