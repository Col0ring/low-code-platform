import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { Outlet, useMatch } from 'react-router-dom'
import UserActions from '@/features/auth/components/user-actions'
import './style.less'

const DesignLayout: React.FC = () => {
  const match = useMatch({
    path: '/design/page-designer',
  })
  console.log(match)
  return (
    <Layout className="design-layout">
      <Layout.Header className="design-header">
        <div className="flex justify-between items-center">
          <Button
            icon={<AppstoreOutlined className="text-g" />}
            shape="circle"
          />
          <div className="flex items-center">
            <Button>预览</Button>
            <Button>保存</Button>
            <UserActions />
          </div>
        </div>
      </Layout.Header>
      <Layout.Content className="design-main">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default DesignLayout
