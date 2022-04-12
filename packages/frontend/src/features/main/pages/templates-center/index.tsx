import React from 'react'
import { Tabs } from 'antd'
import TemplateList from './template-list'
import MyTemplateList from './my-template-list'

const TemplatesCenterPage: React.FC = () => {
  return (
    <div>
      <Tabs centered size="large">
        <Tabs.TabPane tab="全部模板" key="all">
          <TemplateList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="我的模板" key="me">
          <MyTemplateList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default TemplatesCenterPage
