import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import { Card, Space } from 'antd'
import {
  AppleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from '@ant-design/icons'
import MenuPaneItem, { MenuPaneItemProps } from './menu-pane-item'
import MenuContent from './menu-content'

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
    content: <div />,
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