import React, { useMemo, useState } from 'react'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  BugOutlined,
  BlockOutlined,
} from '@ant-design/icons'
import MenuPaneItem, { MenuPaneItemProps } from './menu-pane-item'
import MenuContent from './menu-content'
import ComponentsLibraryPane from './panes/components-library-pane'
import OutlineTreePane from './panes/outline-tree-pane'
import OperationHistoryPane from './panes/operation-history-pane'
import DataSourcePane from './panes/data-source-pane'
import ActionPane from './panes/action-pane'
import BlockPane from './panes/block-pane'

const panes: {
  icon: React.ReactNode
  title?: React.ReactNode
  name: string
  content: React.ReactNode
}[] = [
  {
    icon: <ApartmentOutlined />,
    name: '大纲树',
    content: <OutlineTreePane />,
  },
  {
    icon: <AppstoreOutlined />,
    name: '组件库',
    content: <ComponentsLibraryPane />,
  },
  {
    icon: <BlockOutlined />,
    name: '区块',
    content: <BlockPane />,
  },
  {
    icon: <DatabaseOutlined />,
    name: '数据源',
    content: <DataSourcePane />,
  },
  {
    icon: <BugOutlined />,
    name: '动作面板',
    content: <ActionPane />,
  },
  {
    icon: <HistoryOutlined />,
    name: '操作历史',
    content: <OperationHistoryPane />,
  },
  // {
  //   icon: <AppleOutlined />,
  //   title: '提交历史',
  //   content: <div />,
  // },
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
            key={pane.name}
            {...pane}
            title={pane.name}
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
              key={pane.name}
              className={activePane === pane ? '' : 'hidden'}
              title={pane.title || pane.name}
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
