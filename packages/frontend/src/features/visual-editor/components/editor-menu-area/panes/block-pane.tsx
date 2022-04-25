import { Divider, Form, Input, Modal, Space } from 'antd'
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import React, { useMemo, useState } from 'react'
import { Draggable } from '../../dragging'
import { DraggingData } from '../../../constants'
import { useEditorContext } from '@/features/visual-editor/provider'
import { useEditorPropsContext } from '@/features/visual-editor/editor-props-context'
import { safeJsonParser } from '@/utils'
import { ComponentRenderNode } from '@/features/visual-editor/type'
import { Block } from '@/features/design/type'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'

interface BlockHoverItemProps {
  block: Block
}

const BlockHoverItem: React.FC<BlockHoverItemProps> = ({ block }) => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const { onBlockDelete, onBlockUpdate } = useEditorPropsContext()
  return (
    <div
      className="block-item"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Space>
        <AppstoreAddOutlined />
        {block.name}
      </Space>
      {visible && (
        <Space>
          <ModalButton
            modalTitle="修改区块"
            onModalOK={async () => {
              const { name } = await form.validateFields()
              onBlockUpdate(
                {
                  blockId: block.id,
                  name,
                },
                block
              )
            }}
            modal={
              <Form
                initialValues={{
                  name: block.name,
                }}
                preserve={false}
                form={form}
              >
                <Form.Item
                  label="区块名称"
                  name="name"
                  rules={[emptyValidator('区块名称')]}
                >
                  <Input />
                </Form.Item>
              </Form>
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderButton={({ size: _, ...props }) => (
              <SettingOutlined {...props} className="text-gray-500" />
            )}
          />
          <DeleteOutlined
            className="text-red-500"
            onClick={() => {
              Modal.confirm({
                title: `确定要删除区块 ${block.name} 吗？`,
                content: '删除后不可恢复',
                onOk() {
                  onBlockDelete({ blockId: block.id }, block)
                },
              })
            }}
          />
        </Space>
      )}
    </div>
  )
}

const BlockPane: React.FC = () => {
  const [, { setEditorState }] = useEditorContext()
  const { onBlockSearch, blocks } = useEditorPropsContext()
  const renderBlocks = useMemo(() => {
    return blocks.map((block) => ({
      ...block,
      node: safeJsonParser(block.content, {} as ComponentRenderNode),
    }))
  }, [blocks])
  const dragImage = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'draggable'
    return div
  }, [])

  return (
    <div className="block-pane">
      <div className="search">
        <div className="search-input">
          <Input.Search
            placeholder="搜索区块"
            allowClear
            onSearch={onBlockSearch}
          />
        </div>
        <Divider className="my-3" />
      </div>
      <div className="blocks">
        {renderBlocks.map((block) => {
          return (
            <Draggable
              key={block.id}
              onDragStart={(_, e) => {
                dragImage.innerHTML = block.name
                document
                  .getElementById('editor-drag-image-container')
                  ?.appendChild(dragImage)
                e.dataTransfer.setDragImage(dragImage, 10, 10)
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData(
                  DraggingData.ComponentNode,
                  JSON.stringify({
                    node: block.node,
                    type: 'add-block',
                  })
                )
                setEditorState({
                  isDragging: true,
                  actionNode: null,
                  hoveringNode: null,
                })
              }}
              onDragEnd={() => {
                document
                  .getElementById('editor-drag-image-container')
                  ?.removeChild(dragImage)
                requestAnimationFrame(() => {
                  setEditorState({
                    isDragging: false,
                  })
                })
              }}
            >
              <BlockHoverItem block={block} />
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}

export default BlockPane
