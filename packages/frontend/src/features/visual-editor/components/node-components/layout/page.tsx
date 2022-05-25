import React, { useEffect, useMemo, useState } from 'react'
import {
  ComponentRenderNode,
  NodeComponent,
} from '@/features/visual-editor/type'
import { ScreenProps } from './screen'
import { parserActions, renderNode } from '..'
import { getId, paramsToObject } from '@/utils'
import { useEditorContext } from '@/features/visual-editor/provider'
import NodeContainer from '../../node-container'
import { Collapse, Form } from 'antd'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import { useSearchParams } from 'react-router-dom'
import SvgIcon from '@/components/svg-icon'
import PageIcon from '../../../assets/components/page.svg?raw'

const Page: NodeComponent = ({ node, editType }) => {
  const { children, actions: actionsProp, style } = node

  const [params] = useSearchParams()
  const { actions } = useEditorPreviewContext()
  const { onMounted, ...events } = useMemo(
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

  useEffect(() => {
    onMounted?.(undefined, paramsToObject(params.entries()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="node-page" style={style} {...events}>
      {editType === 'prod'
        ? renderNode(screen || children[0])
        : children.map((child, index) => {
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
          <AddAction
            menus={[
              { event: 'onClick', title: '点击页面' },
              { event: 'onMounted', title: '初次加载' },
            ]}
          />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
Page.PropsForm = PagePropsForm
Page.getInitialStyle = () => ({
  display: 'block',
})
Page.getInitialProps = () => ({})
Page.getInitialChildren = () => []
Page.getId = () => getId('page')
Page.nodeName = 'page'
Page.title = '页面'
Page.icon = <SvgIcon raw={PageIcon} />

export default Page
