import { Col, Divider, Input, Row, Space } from 'antd'
import React, { useMemo } from 'react'
import { Draggable } from '../../dragging'
import { componentsLibrary } from '../../node-components'
import { DraggingData } from '../../../constants'
import { useEditorContext } from '@/features/visual-editor/provider'

const ComponentsLibraryPane: React.FC = () => {
  const [, { setEditorState }] = useEditorContext()
  const dragImage = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'draggable'
    return div
  }, [])
  return (
    <div className="components-library-pane">
      <div className="search">
        <div className="search-input">
          <Input.Search placeholder="搜索组件" allowClear />
        </div>
        <Divider className="my-3" />
      </div>
      <div className="components">
        {componentsLibrary.map(({ group, components }) => {
          return (
            <div className="mb-5 text-sm px-3" key={group}>
              <h3>{group}</h3>
              <div className="mt-2">
                <Row gutter={[10, 10]}>
                  {components.map((component) => {
                    return component.hideInMenu ? null : (
                      <Col span={12} key={component.name}>
                        <Draggable
                          onDragStart={(_, e) => {
                            dragImage.innerHTML =
                              component.title || component.name
                            document
                              .getElementById('editor-drag-image-container')
                              ?.appendChild(dragImage)
                            e.dataTransfer.setDragImage(dragImage, 10, 10)
                            e.dataTransfer.effectAllowed = 'move'
                            e.dataTransfer.setData(
                              DraggingData.ComponentNode,
                              JSON.stringify({
                                name: component.name,
                                type: 'add',
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
                          <div className="component-item">
                            <Space>
                              {component.icon}
                              {component.title || component.name}
                            </Space>
                          </div>
                        </Draggable>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentsLibraryPane
