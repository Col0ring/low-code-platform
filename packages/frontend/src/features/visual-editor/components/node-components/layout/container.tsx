import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent } from '../../../type'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'
import { parserActions, renderNodes } from '..'
import { Collapse, Form } from 'antd'
import AddAction from '../../add-action/inidex'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import { ContainerOutlined } from '@ant-design/icons'

const Container: NodeComponent = ({
  node,
  parentNodes,
  disabled,
  editType,
}) => {
  const { children, style, actions: actionsProp } = node
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
    <div style={style} {...events}>
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

const ContainerPropsForm: typeof Container['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['actions']} bordered={false}>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击容器' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}

Container.PropsForm = ContainerPropsForm
Container.nodeName = 'container'
Container.title = '容器'
Container.getInitialStyle = () => ({ display: 'block' })
Container.getInitialProps = () => ({})
Container.getInitialChildren = () => []
Container.getId = () => getId('container')
Container.icon = <ContainerOutlined />
export default Container
