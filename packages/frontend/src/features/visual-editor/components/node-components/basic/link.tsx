import { getId } from '@/utils'
import { Collapse, Form, Input, Switch } from 'antd'
import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { parserActions, propItemName } from '..'
import { NodeComponent } from '../../../type'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'

export interface LinkProps {
  content: string
  href: string
  openInNewTab?: boolean
  openInNewWindow?: boolean
}

const Link: NodeComponent<LinkProps> = ({ node, editType }) => {
  const {
    props: { content, openInNewTab, openInNewWindow, href },
    style,
    actions: actionsProp,
  } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  // eslint-disable-next-line react/no-children-prop
  return React.createElement(openInNewWindow ? 'a' : NavLink, {
    [openInNewWindow ? ('href' as 'to') : 'to']: href,
    target: openInNewTab ? '_blank' : '_self',
    style,
    children: content,
    ...events,
  })
}

const LinkPropsForm: typeof Link['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="属性" key="props">
        <Form.Item label="内容" name={propItemName('content')}>
          <Input />
        </Form.Item>
        <Form.Item label="链接地址" name={propItemName('href')}>
          <Input />
        </Form.Item>
        <Form.Item
          label="新开页面"
          name={propItemName('openInNewTab')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="外部链接"
          name={propItemName('openInNewWindow')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击链接' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Link.PropsForm = LinkPropsForm
Link.nodeName = 'link'
Link.title = '链接'
Link.getInitialStyle = () => ({
  display: 'inline',
})
Link.getInitialProps = () => ({
  content: '链接',
  href: '',
  openInNewTab: false,
  openInNewWindow: false,
})
Link.getId = () => getId('link')
export default Link
