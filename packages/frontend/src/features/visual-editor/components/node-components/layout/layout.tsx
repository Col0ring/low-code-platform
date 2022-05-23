import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'
import { parserActions, renderNodes } from '..'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import { Collapse, Form } from 'antd'
import AddAction from '../../add-action/inidex'
import { LayoutOutlined } from '@ant-design/icons'

const Layout: NodeComponent = ({ node, parentNodes, disabled, editType }) => {
  const { children, actions: actionsProp, style } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )

  return (
    <div {...events} style={style}>
      {editType === 'prod' ? (
        renderNodes(children)
      ) : children.length === 0 ? (
        <BlankContent disabled={disabled} node={node} />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              disabled={disabled}
              index={index}
              key={child.id}
              node={child}
              parentNodes={childParentNodes}
            />
          )
        })
      )}
    </div>
  )
}

const LayoutPropsForm: typeof Layout['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['actions']} bordered={false}>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击布局' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Layout.PropsForm = LayoutPropsForm
Layout.nodeName = 'layout'
Layout.title = '布局'
Layout.getInitialProps = () => ({})
Layout.getInitialStyle = () => ({ display: 'block' })
Layout.getInitialChildren = () => []
Layout.icon = <LayoutOutlined />
Layout.getId = () => getId('layout')

export default Layout
