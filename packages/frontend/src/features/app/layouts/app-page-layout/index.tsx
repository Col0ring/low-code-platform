import MenuLayout from '@/components/menu-layout'
import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, AutoCompleteProps } from 'antd'
import { PlusOutlined, ContainerOutlined } from '@ant-design/icons'
import { Path } from '@/router/constants'
import { Outlet, useParams } from 'react-router'

const pages = [
  {
    icon: <ContainerOutlined className="text-yellow-500" />,
    title: 'page1',
    path: Path.AppPageDetail('2', '111'),
    key: Path.AppPageDetail('2', '111'),
  },
  {
    icon: <ContainerOutlined className="text-yellow-500" />,
    title: 'page2',
    path: Path.AppPageDetail('2', '222'),
    key: Path.AppPageDetail('2', '222'),
  },
]

const AppPageLayout: React.FC = () => {
  const { appId } = useParams() as { appId: string }
  useEffect(() => {
    // wait data
  }, [])
  const [options, setOptions] = useState<AutoCompleteProps['options']>(() =>
    pages.map((page) => ({
      value: page.path,
      label: page.title,
    }))
  )

  return (
    <MenuLayout
      extra={
        <div className="w-full flex px-3 pb-3">
          <AutoComplete
            allowClear
            placeholder="搜索"
            className="flex-1"
            onSelect={() => {
              //
            }}
            onSearch={(value) => {
              console.log(123)
            }}
            options={options}
          />
          <Button
            className="ml-2 flex-shrink-0"
            type="primary"
            icon={<PlusOutlined />}
          />
        </div>
      }
      menus={pages}
    >
      <Outlet />
    </MenuLayout>
  )
}

export default AppPageLayout
