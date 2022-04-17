import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { Form, Modal, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useEditorContext } from '@/features/visual-editor/provider'
import ModalButton from '@/components/modal-button'
import { stopPropagation } from '@/utils'

export interface PageHoverItemProps {
  type: 'params' | 'var' | 'remote'
  name: string
  hideAction?: boolean
}

const PanelItemHeader: React.FC<PageHoverItemProps> = ({
  name,
  hideAction,
}) => {
  const [editForm] = Form.useForm()
  const [{ page }, { updatePageData }] = useEditorContext()
  return (
    <div className="flex justify-between w-full">
      <Space className="font-bold">
        <span className="text-green-400">参数</span>dp1
      </Space>
      {hideAction && (
        <Space>
          <Tooltip title="编辑">
            <ModalButton
              modalTitle="编辑数据源"
              modal={
                <Form form={editForm} preserve={false}>
                  1
                </Form>
              }
              onClick={stopPropagation}
              icon={<EditOutlined />}
              type="text"
            />
          </Tooltip>
          <Tooltip title="删除">
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation()
                Modal.confirm({
                  title: `确认删除数据源 ${name} 吗？`,
                  onOk() {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { name: _name, ...dataSources } = page.dataSources
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
