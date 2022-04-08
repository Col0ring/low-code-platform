import React, { useMemo } from 'react'
import { Layout, Row, Col, Breadcrumb, Tabs, Tag, Space, Spin } from 'antd'
import {
  Outlet,
  useLocation,
  Link,
  useParams,
  Navigate,
} from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
import './style.less'
import DefaultAppIcon from '@/features/main/components/default-app-icon'
import { getActiveKey } from '@/router'
import NavigationDropdown from '../../components/navigation-dropdown'
import { useGetAppDetailQuery } from '../../app.service'
import RouteLoading from '@/router/route-loading'
import { AppStatus } from '@/features/main/constants'

const AppLayout: React.FC = () => {
  const { appId } = useParams() as { appId: string }
  const { pathname } = useLocation()
  const tabPaths = useMemo(
    () => [
      {
        path: Path.AppPage(appId) + '/*',
        key: 'page',
      },
      {
        path: Path.AppSetting(appId),
        key: 'setting',
      },
      {
        path: Path.AppPublish(appId),
        key: 'publish',
      },
    ],
    [appId]
  )
  const activeKey = useMemo(
    () => getActiveKey(tabPaths, pathname),
    [pathname, tabPaths]
  )
  const { data, isFetching } = useGetAppDetailQuery(+appId)

  return isFetching ? (
    <RouteLoading loadingFullScreen />
  ) : data ? (
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
                    {data.name}
                    <Tag
                      color={
                        data.status === AppStatus.Active ? 'success' : 'error'
                      }
                    >
                      {data.status === AppStatus.Active ? '已启用' : '未启用'}
                    </Tag>
                  </Space>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </Col>
          <Col span={10}>
            <div className="app-header-navbar">
              <Tabs activeKey={activeKey}>
                <Tabs.TabPane
                  tab={<Link to={Path.AppPage(appId)}>页面管理</Link>}
                  key="page"
                />
                <Tabs.TabPane
                  tab={<Link to={Path.AppSetting(appId)}>应用设置</Link>}
                  key="setting"
                />
                {/* <Tabs.TabPane
                tab={<Link to={Path.AppPublish(appId)}>应用发布</Link>}
                key="publish"
              /> */}
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
        <Outlet context={data} />
      </Layout.Content>
    </Layout>
  ) : (
    <Navigate to={Path.AppCenter} replace />
  )
}

export default AppLayout
