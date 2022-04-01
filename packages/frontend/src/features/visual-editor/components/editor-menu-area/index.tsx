import React, { useMemo, useState } from 'react'
import { AppleOutlined } from '@ant-design/icons'
import MenuPaneItem, { MenuPaneItemProps } from './menu-pane-item'
import MenuContent from './menu-content'
import ComponentsLibraryPane from './panes/components-library-pane'
import OutlineTreePane from './panes/outline-tree-pane'

const panes: (Pick<MenuPaneItemProps, 'icon' | 'title'> & {
  content: React.ReactNode
})[] = [
  {
    icon: <AppleOutlined />,
    title: '大纲树',
    content: <OutlineTreePane />,
  },
  {
    icon: <AppleOutlined />,
    title: '组件库',
    content: <ComponentsLibraryPane />,
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
  const [visited, setVisited] = useState<Record<number, boolean>>(() => ({}))
  const onPaneClick: MenuPaneItemProps['onClick'] = ({ index }) => {
    if (!visited[index]) {
      setVisited({ ...visited, [index]: true })
    }
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

      {panes.map(
        (pane, index) =>
          visited[index] && (
            <MenuContent
              key={pane.title}
              className={activePane === pane ? '' : 'hidden'}
              title={pane.title}
              fixed={fixed}
              onFixedButtonClick={setFixed}
              onCloseButtonClick={onCloseButtonClick}
            >
              {pane.content}
            </MenuContent>
          )
      )}
    </div>
  )
}

export default EditorMenuArea
