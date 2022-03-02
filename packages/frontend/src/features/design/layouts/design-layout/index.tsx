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

const DesignLayout: React.FC = () => {
  const { pathname } = useLocation()
  const activeKey = useMemo(() => getActiveKey(pathname), [pathname])
  const [visible, setVisible] = useState(false)

  return (
    <Layout className="design-layout">
      <Layout.Header className="design-header">
        <Row gutter={10}>
          <Col span={7}>
            <div className="design-header-navigation">
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
