import { getId } from '@/utils'
import { VideoCameraOutlined } from '@ant-design/icons'
import { Collapse, Form, Input, Slider, Switch } from 'antd'
import React, { useMemo } from 'react'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import VariableBinding from '../../variable-binding'

export type VideoProps = ReactPlayerProps

const Video: NodeComponent<VideoProps> = ({ node, editType }) => {
  const { props, style, actions: actionsProp } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  return (
    <ReactPlayer
      {...props}
      style={style}
      width={style.width}
      height={style.height}
      {...events}
    />
  )
}

const VideoPropsForm: typeof Video['PropsForm'] = () => {
  return (
    <Collapse
      defaultActiveKey={['props', 'player', 'actions']}
      bordered={false}
    >
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="视频链接" name={propItemName('url')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="播放器设置" key="player">
        <Form.Item
          tooltip="默认渲染时会判断该值，并且可以通过后期绑定变量动态控制视频播放"
          label="是否播放"
          name={propItemName('playing')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="显示控件"
          name={propItemName('controls')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="音量" name={propItemName('volume')}>
          <VariableBinding>
            <Slider
              tipFormatter={(value) =>
                `${Number.parseInt(String(Number(value) * 100))}%`
              }
              min={0}
              max={1}
              step={0.01}
            />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="播放速率" name={propItemName('playbackRate')}>
          <VariableBinding>
            <Slider
              max={2}
              step={0.25}
              min={0.5}
              marks={{ 0.5: '0.5', 1: '1', 1.5: '1.5', 2: '2' }}
            />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="循环播放"
          name={propItemName('loop')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
        <Form.Item
          label="是否静音"
          name={propItemName('muted')}
          valuePropName="checked"
        >
          <VariableBinding valuePropName="checked">
            <Switch />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击视频' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Video.PropsForm = VideoPropsForm
Video.nodeName = 'video'
Video.title = '视频'
Video.getInitialStyle = () => ({
  display: 'inline-block',
})
Video.getInitialProps = () => ({
  url: 'https://cloud.video.taobao.com/play/u/1804320196/p/1/e/6/t/1/287344840104.mp4',
  controls: true,
  playing: false,
  loop: false,
  muted: false,
  volume: 1,
  playbackRate: 1,
})
Video.getId = () => getId('video')
Video.icon = <VideoCameraOutlined />
export default Video
