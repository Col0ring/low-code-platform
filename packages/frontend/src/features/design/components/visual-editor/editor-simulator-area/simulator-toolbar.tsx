import React, { useRef, useState } from 'react'
import { Tooltip, Divider, Button, Radio } from 'antd'
import redoSvg from '../assets/redo.svg?raw'
import undoSvg from '../assets/undo.svg?raw'
import {
  DownloadOutlined,
  UploadOutlined,
  FileAddOutlined,
  MinusSquareOutlined,
  ClearOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import SvgIcon from '@/components/svg-icon'
import { useMount, useResize } from '@/hooks'
import { elementCanScroll } from '@/utils'

const tools = [
  [
    {
      element: <Button size="small" icon={<FileAddOutlined />} />,
      title: '新增页面',
    },
    {
      element: <Button size="small" icon={<CopyOutlined />} />,
      title: '复制页面',
    },
    {
      element: <Button size="small" icon={<ClearOutlined />} />,
      title: '清空页面',
    },
    {
      element: <Button size="small" icon={<MinusSquareOutlined />} />,
      title: '删除页面',
    },
  ],
  [
    {
      element: <Button size="small" icon={<SvgIcon raw={undoSvg} />} />,
      title: '撤销 command + z',
    },
    {
      element: <Button size="small" icon={<SvgIcon raw={redoSvg} />} />,
      title: '重做 command + shift + z',
    },
  ],
  [
    {
      element: <Button size="small" icon={<UploadOutlined />} />,
      title: '导入页面',
    },
    {
      element: <Button size="small" icon={<DownloadOutlined />} />,
      title: '导出页面',
    },
  ],
]

const SimulatorToolbar: React.FC = () => {
  const [canScroll, setCanScroll] = useState(false)
  const [screen, setScreen] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useResize(ref, (el) => {
    setCanScroll(elementCanScroll(el))
  })

  useMount(() => {
    if (ref.current) {
      const el = ref.current
      setCanScroll(elementCanScroll(el))
    }
  })

  return (
    <div className="simulator-toolbar-container">
      <div className="simulator-toolbar" ref={ref}>
        <div className="flex items-center">
          {tools.map((group, index) => {
            return (
              <React.Fragment key={index}>
                {group.map(({ title, element }, i) => {
                  return (
                    <Tooltip title={title} key={i} placement="bottom">
                      {element}
                    </Tooltip>
                  )
                })}
                {index !== tools.length - 1 && (
                  <Divider type="vertical" className="h-7" />
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="flex items-center">
          {canScroll && <Divider type="vertical" className="h-7" />}
          <Radio.Group
            value={screen}
            onChange={(e) => setScreen(e.target.value)}
            size="small"
          >
            <Radio.Button value="small">小屏幕</Radio.Button>
            <Radio.Button value="2">中屏幕</Radio.Button>
            <Radio.Button value="3">大屏幕</Radio.Button>
          </Radio.Group>
          <Divider type="vertical" className="h-7" />
          <Button size="small">预览</Button>
          <Button size="small" type="primary">
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SimulatorToolbar
