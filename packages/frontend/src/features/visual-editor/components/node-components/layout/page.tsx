import React, { useEffect, useMemo, useState } from 'react'
import {
  ComponentRenderNode,
  NodeComponent,
} from '@/features/visual-editor/type'
import { ScreenProps } from './screen'
import { parserActions, renderNode } from '..'
import { getId } from '@/utils'
import { useEditorContext } from '@/features/visual-editor/provider'
import NodeContainer from '../../node-container'
import { Collapse, Form } from 'antd'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'

const Page: NodeComponent = ({ node, editType }) => {
  const { children, actions: actionsProp, style } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const [screen, setScreen] = useState(() =>
    children.find(
      (child: ComponentRenderNode<ScreenProps>) =>
        child.props.minWidth <= window.innerWidth &&
        (child.props.maxWidth === 'max' ||
          child.props.maxWidth >= window.innerWidth)
    )
  )
  const [{ currentScreen }] = useEditorContext(false) || [{}, {}]
  useEffect(() => {
    function onResize() {
      setScreen(
        children.find(
          (child: ComponentRenderNode<ScreenProps>) =>
            child.props.minWidth <= window.innerWidth &&
            (child.props.maxWidth === 'max' ||
              child.props.maxWidth >= window.innerWidth)
        )
      )
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [children])

  if (editType === 'prod') {
    return renderNode(screen || children[0])
  }

  return (
    <div className="node-page" style={style} {...events}>
      {children.map((child, index) => {
        return currentScreen?.id === child.id ? (
          <NodeContainer
            index={index}
            parentNodes={[node]}
            key={child.id}
            node={child}
            hasAction={false}
          />
        ) : null
      })}
    </div>
  )
}

const PagePropsForm: typeof Page['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击按钮' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Page.PropsForm = PagePropsForm
Page.getInitialStyle = () => ({})
Page.getInitialProps = () => ({})
Page.getInitialChildren = () => []
Page.getId = () => getId('page')
Page.nodeName = 'page'
Page.title = '页面'

export default Page
