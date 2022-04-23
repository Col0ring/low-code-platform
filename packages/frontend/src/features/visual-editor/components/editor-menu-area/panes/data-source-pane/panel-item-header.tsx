import { DeleteOutlined } from '@ant-design/icons'
import { Modal, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useEditorContext } from '@/features/visual-editor/provider'
import VariableFormButton from './variable-form-button'
import RemoteFormButton from './remote-form-button'
import { RemoteDataSource, VarDataSource } from '@/features/visual-editor/type'

export interface PageHoverItemProps {
  type: 'params' | 'var' | 'remote'
  name: string
  hideAction?: boolean
}

const headers = {
  params: {
    className: 'text-orange-400',
    title: '参数',
  },
  var: {
    className: 'text-green-400',
    title: '变量',
  },
  remote: {
    className: 'text-blue-400',
    title: '远程',
  },
}

const PanelItemHeader: React.FC<PageHoverItemProps> = ({
  type,
  name,
  hideAction,
}) => {
  const [{ page }, { updatePageData }] = useEditorContext()
  const [tooltipVisible, setTooltipVisible] = useState(false)
  return (
    <div className="flex justify-between w-full">
      <Space className="font-bold">
        <span className={headers[type].className}>{headers[type].title}</span>
        {name}
      </Space>
      {!hideAction && (
        <Space>
          <Tooltip
            visible={tooltipVisible}
            title="编辑"
            onVisibleChange={setTooltipVisible}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                setTooltipVisible(false)
              }}
            >
              {type === 'var' && (
                <VariableFormButton
                  type="edit"
                  initialValues={page.dataSources[name] as VarDataSource}
                />
              )}
              {type === 'remote' && (
                <RemoteFormButton
                  type="edit"
                  initialValues={page.dataSources[name] as RemoteDataSource}
                />
              )}
            </div>
          </Tooltip>
          <Tooltip title="删除">
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation()
                Modal.confirm({
                  title: `确认删除数据源 ${name} 吗？`,
                  onOk() {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [name]: _name, ...dataSources } = page.dataSources
                    updatePageData({
                      dataSources: dataSources,
                    })
                  },
                })
              }}
            />
          </Tooltip>
        </Space>
      )}
    </div>
  )
}

export default PanelItemHeader
