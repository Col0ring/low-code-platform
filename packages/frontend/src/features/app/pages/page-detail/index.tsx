import EditorPreview, {
  EditorPreviewProps,
} from '@/features/visual-editor/components/editor-preview'
import { Path } from '@/router/constants'
import { DeliveredProcedureOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface OpenNewPageHoverItemProps {
  path: string
}
const OpenNewPageHoverItem: React.FC<OpenNewPageHoverItemProps> = ({
  children,
  path,
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <div
      className="w-100px flex items-center justify-between"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Link to={path} className="text-current">
        {children}
      </Link>
      {visible && (
        <Tooltip title="新开标签页打开" placement="bottomRight">
          <Link className="text-current" to={path} target="_blank">
            <DeliveredProcedureOutlined />
          </Link>
        </Tooltip>
      )}
    </div>
  )
}

const nodes = [
  {
    title: '屏幕',
    name: 'screen',
    style: {},
    id: 'screen_52_2mYMdYp',
    props: {
      title: '屏幕1',
    },
    children: [
      {
        title: '容器',
        name: 'container',
        style: {},
        id: 'container_cLTFnjYogC',
        props: {},
        children: [
          {
            title: '文本',
            name: 'text',
            style: {},
            id: 'text_ildec3qmEp',
            props: {},
          },
          {
            title: '文本',
            name: 'text',
            style: {},
            id: 'text_la94gjYLx1',
            props: {},
          },
        ],
      },
    ],
  },
  {
    title: '屏幕',
    name: 'screen',
    style: {},
    id: 'screen_uT47KQAuUw',
    props: {
      title: '222',
    },
    children: [
      {
        title: '布局容器',
        name: 'layout-container',
        style: {},
        id: 'layout-container_OJ6b8i74w6',
        props: {
          spans: '8:8:8',
        },
        children: [
          {
            title: '布局',
            name: 'layout',
            style: {},
            id: 'layout_1PFCvEsk5h',
            props: {
              children: [],
            },
            children: [
              {
                title: '文本',
                name: 'text',
                style: {},
                id: 'text_j0zXKeMS75',
                props: {},
              },
            ],
          },
          {
            title: '布局',
            name: 'layout',
            style: {},
            id: 'layout_kPEiwqD5Rg',
            props: {
              children: [],
            },
            children: [
              {
                title: '文本',
                name: 'text',
                style: {},
                id: 'text_JGmUfxLL0n',
                props: {},
              },
            ],
          },
          {
            title: '布局',
            name: 'layout',
            style: {},
            id: 'layout_KhfjzV80We',
            props: {
              children: [],
            },
            children: [
              {
                title: '文本',
                name: 'text',
                style: {},
                id: 'text_SHPx7ysUfH',
                props: {},
              },
            ],
          },
        ],
      },
    ],
  },
]
const PageDetailPage: React.FC = () => {
  const [screens, setScreens] = useState<EditorPreviewProps['screens']>(nodes)
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white flex justify-between items-center p-4">
        <h2 className="text-lg font-bold">商品列表</h2>
        <Dropdown.Button
          icon={<DownOutlined />}
          type="primary"
          overlay={
            <Menu>
              <Menu.Item key="design">
                <OpenNewPageHoverItem path={Path.DesignIndex}>
                  页面设计
                </OpenNewPageHoverItem>
              </Menu.Item>
              <Menu.Item key="setting">页面设置</Menu.Item>
              <Menu.Item key="publish">页面发布</Menu.Item>
            </Menu>
          }
        >
          <Link to={Path.DesignIndex}>编辑自定义页</Link>
        </Dropdown.Button>
      </div>
      <div className="overflow-auto flex-1">
        <div className="p-4 bg-white rounded-md m-4 h-screen">
          <EditorPreview screens={screens} />
        </div>
      </div>
    </div>
  )
}

export default PageDetailPage
