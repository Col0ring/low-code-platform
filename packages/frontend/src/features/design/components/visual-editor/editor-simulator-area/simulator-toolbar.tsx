import React from 'react'
import { Tooltip, Divider, Button, Radio } from 'antd'
import redoSvg from '../assets/redo.svg?raw'
import undoSvg from '../assets/undo.svg?raw'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import SvgIcon from '@/components/svg-icon'

const SimulatorToolbar: React.FC = () => {
  return (
    <div className="simulator-toolbar">
      <Radio.Group size="small">
        <Radio.Button value="small">小屏幕</Radio.Button>
        <Radio.Button value="2">中屏幕</Radio.Button>
        <Radio.Button value="3">大屏幕</Radio.Button>
      </Radio.Group>
      <Divider type="vertical" className="h-7" />

      <Tooltip title="撤销 command + z" placement="bottom">
        <Button
          size="small"
          className="mr-1"
          icon={<SvgIcon raw={undoSvg} />}
        />
      </Tooltip>
      <Tooltip title="撤销 command + shift + z" placement="bottom">
        <Button size="small" icon={<SvgIcon raw={redoSvg} />} />
      </Tooltip>
      <Divider type="vertical" className="h-7" />
      <Button size="small" className="mr-1" icon={<UploadOutlined />} />
      <Button size="small" icon={<DownloadOutlined />} />
      <Divider type="vertical" className="h-7" />
      <Button size="small" className="mr-1">
        预览
      </Button>
      <Button size="small" type="primary">
        保存
      </Button>
    </div>
  )
}

export default SimulatorToolbar
