import React, { useMemo, useState } from 'react'
import {
  Layout,
  Menu,
  Dropdown,
  Row,
  Col,
  Breadcrumb,
  Button,
  Tabs,
  Tag,
  Space,
} from 'antd'
import {
  AppstoreOutlined,
  GiftOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Outlet, matchPath, useLocation, Link } from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import { Path } from '@/router/constants'
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

const DesignLayoutDropdown: React.FC = () => {
  return (
    <Menu selectable={false}>
      <Menu.Item key={Path.Dashboard} icon={<HomeOutlined />}>
        <span className="inline-flex justify-between w-20 items-center">
          <Link to={Path.Dashboard}>首页</Link>
        </span>
      </Menu.Item>
      <Menu.Item key="/application" icon={<UserOutlined />}>
        我的应用
      </Menu.Item>
      <Menu.Item key="/templates" icon={<GiftOutlined />}>
        模板中心
      </Menu.Item>
    </Menu>
  )
}

const AppLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(pathname), [pathname])
  const [visible, setVisible] = useState(false)

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <Row gutter={10}>
          <Col span={7}>
            <div className="app-header-navigation">
              <Dropdown
                arrow
                trigger={['click']}
                visible={visible}
                onVisibleChange={setVisible}
                overlay={<DesignLayoutDropdown />}
              >
                <Button
                  className="mr-3"
                  icon={<AppstoreOutlined className="text-lg" />}
                  shape="circle"
                />
              </Dropdown>
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Space>
                    <AppstoreOutlined className="bg-blue-400 rounded-md w-24px flex-shrink-0 h-24px flex items-center justify-center leading-none text-white" />
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
