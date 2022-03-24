import React, { useMemo, useState } from 'react'
import { Row, Col, Input, Divider, Space } from 'antd'
import { AppleOutlined } from '@ant-design/icons'
import MenuPaneItem, { MenuPaneItemProps } from './menu-pane-item'
import MenuContent from './menu-content'
import { Draggable } from '../dragging'
import { DraggingData } from '@/features/design/constants'
import { componentsLibrary } from '../node-components'

const panes: (Pick<MenuPaneItemProps, 'icon' | 'title'> & {
  content: React.ReactNode
})[] = [
  {
    icon: <AppleOutlined />,
    title: '大纲树',
    content: <div />,
  },
  {
    icon: <AppleOutlined />,
    title: '组件库',
    content: (
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
                      return (
                        <Col span={12} key={component.name}>
                          <Draggable
                            onDragStart={(_, e) => {
                              e.dataTransfer.effectAllowed = 'move'
                              e.dataTransfer.setData(
                                DraggingData.ComponentNode,
                                JSON.stringify({
                                  a: 1,
                                })
                              )
                            }}
                            className="draggable"
                            draggingClassName="active"
                          >
                            <div className="component-item">
                              <Space>
                                {component.icon}
                                {component.title}
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
    ),
  },
  {
    icon: <AppleOutlined />,
    title: '区块',
    content: <div />,
  },
  {
    icon: <AppleOutlined />,
    title: '操作历史',
    content: <div />,
  },
]

const EditorMenuArea: React.FC = () => {
  const [active, setActive] = useState(-1)
  const [fixed, setFixed] = useState(false)
  const onPaneClick: MenuPaneItemProps['onClick'] = ({ index }) => {
    setActive(index)
  }
  const onCloseButtonClick = () => {
    setActive(-1)
  }

  const activePane = useMemo(() => panes[active], [active])

  return (
    <div className="editor-menu-area">
      <div className="menu-pane">
        {panes.map((pane, index) => (
          <MenuPaneItem
            key={pane.title}
            {...pane}
            index={index}
            onClick={onPaneClick}
            isActive={active === index}
          />
        ))}
      </div>
      {activePane && (
        <MenuContent
          title={activePane.title}
          fixed={fixed}
          onFixedButtonClick={setFixed}
          onCloseButtonClick={onCloseButtonClick}
        >
          {activePane.content}
        </MenuContent>
      )}
    </div>
  )
}

export default EditorMenuArea
