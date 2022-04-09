import EditorPreview, {
  EditorPreviewProps,
} from '@/features/visual-editor/components/editor-preview'
import { Path } from '@/router/constants'
import RouteLoading from '@/router/route-loading'
import { safeJsonParser } from '@/utils'
import { DeliveredProcedureOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd'
import React, { useState, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useGetPageDetailQuery } from '../../app.service'

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

const PageDetailPage: React.FC = () => {
  const { pageId, appId } = useParams() as { pageId: string; appId: string }
  const pageIndexPath = useMemo(() => Path.AppPage(appId), [appId])
  const { data, isFetching } = useGetPageDetailQuery({
    pageId: +pageId,
    appId: +appId,
  })
  const pageContent = useMemo(
    () =>
      data
        ? safeJsonParser(data.content, [] as EditorPreviewProps['screens'])
        : [],
    [data]
  )
  const designPath = useMemo(
    () => ({
      index: Path.DesignIndex(appId, pageId),
      setting: Path.DesignBasicSetting(appId, pageId),
    }),
    [appId, pageId]
  )
  return (
    <div className="h-full flex flex-col overflow-hidden p-1">
      {isFetching ? (
        <RouteLoading />
      ) : data ? (
        <>
          <div className="bg-white flex justify-between items-center p-4">
            <h2 className="text-lg font-bold">{data.name}</h2>
            <Dropdown.Button
              icon={<DownOutlined />}
              type="primary"
              overlay={
                <Menu>
                  <Menu.Item key="design">
                    <OpenNewPageHoverItem path={designPath.index}>
                      页面设计
                    </OpenNewPageHoverItem>
                  </Menu.Item>
                  <Menu.Item key="setting">
                    <OpenNewPageHoverItem path={designPath.setting}>
                      页面设置
                    </OpenNewPageHoverItem>
                  </Menu.Item>
                </Menu>
              }
            >
              <Link to={designPath.index}>编辑自定义页</Link>
            </Dropdown.Button>
          </div>
          {pageContent.length > 0 && (
            <div className="overflow-auto flex-1">
              <div className="p-4 bg-white rounded-md m-4">
                <EditorPreview screens={pageContent} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Navigate to={pageIndexPath} replace />
      )}
    </div>
  )
}

export default PageDetailPage
