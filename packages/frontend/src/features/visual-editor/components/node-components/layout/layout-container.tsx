import React, { useMemo, useEffect } from 'react'
import { Row, Col, Collapse, Form, Input } from 'antd'
import { getId } from '@/utils'
import { NodeComponent } from '../../../type'
import { createNewNode, parserActions, propItemName, renderNode } from '..'
import NodeContainer from '../../node-container'
import { useEditorContext } from '@/features/visual-editor/provider'
import Layout from './layout'
import { useEditorPreviewContext } from '../../editor-preview/provider'
import AddAction from '../../add-action/inidex'
import SvgIcon from '@/components/svg-icon'
import LayoutContainerIcon from '../../../assets/components/layout-container.svg?raw'
import VariableBinding from '../../variable-binding'

const layoutName = Layout.nodeName

function parseSpan(spans: string) {
  const res = spans.split(':').map((v) => (v ? Number(v) : Number.NaN))
  if (res.some((v) => Number.isNaN(v))) {
    return null
  }
  return res
}

export interface LayoutContainerProps {
  spans: string
}

const LayoutContainer: NodeComponent<LayoutContainerProps> = ({
  node,
  parentNodes,
  disabled,
  editType,
}) => {
  const {
    children,
    props: { spans, ...rowProps },
    actions: actionsProp,
    style,
  } = node
  const { actions } = useEditorPreviewContext()
  const events = useMemo(
    () => parserActions(actionsProp || {}, actions, editType),
    [actions, actionsProp, editType]
  )
  const [, { updateComponentNode }] = useEditorContext(false) || [{}, {}]
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  const ColSpanArr = useMemo(() => parseSpan(spans), [spans])
  useEffect(() => {
    if (editType === 'edit' && ColSpanArr) {
      if (ColSpanArr.length !== children.length) {
        const extraChildren =
          ColSpanArr.length > children.length
            ? new Array(ColSpanArr.length - children.length)
                .fill(0)
                .map(() => createNewNode(layoutName))
            : []
        updateComponentNode?.({
          type: 'update',
          addSnapshot: false,
          node,
          props: node.props,
          children: [
            ...node.children.slice(0, ColSpanArr.length),
            ...extraChildren,
          ],
        })
      }
    }
  }, [
    node.children,
    ColSpanArr,
    children.length,
    updateComponentNode,
    node,
    editType,
  ])
  return (
    <Row {...events} style={style} {...rowProps}>
      {ColSpanArr &&
        ColSpanArr.map((span, index) => {
          const child = children[index]
          return (
            <Col span={span} key={child?.id || index}>
              {child &&
                (editType === 'edit' ? (
                  <NodeContainer
                    disabled={disabled}
                    index={index}
                    key={child.id}
                    node={child}
                    parentNodes={childParentNodes}
                  />
                ) : (
                  renderNode(child)
                ))}
            </Col>
          )
        })}
    </Row>
  )
}
const LayoutContainerPropsForm: typeof LayoutContainer['PropsForm'] = () => {
  return (
    <Collapse defaultActiveKey={['props', 'actions']} bordered={false}>
      <Collapse.Panel header="动作设置" key="props">
        <Form.Item label="栅格比例" name={propItemName('spans')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
        <Form.Item label="栅格间隔" name={propItemName('gutter')}>
          <VariableBinding>
            <Input />
          </VariableBinding>
        </Form.Item>
      </Collapse.Panel>
      <Collapse.Panel header="动作设置" key="actions">
        <Form.Item name="actions">
          <AddAction menus={[{ event: 'onClick', title: '点击布局容器' }]} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  )
}
LayoutContainer.PropsForm = LayoutContainerPropsForm
LayoutContainer.nodeName = 'layout-container'
LayoutContainer.title = '布局容器'
LayoutContainer.childActionDisabled = true
LayoutContainer.getInitialStyle = () => ({ display: 'flex' })
LayoutContainer.getInitialProps = () => ({
  spans: '8:8:8',
})
LayoutContainer.getInitialChildren = () => [
  createNewNode(layoutName),
  createNewNode(layoutName),
  createNewNode(layoutName),
]
LayoutContainer.icon = <SvgIcon raw={LayoutContainerIcon} />
LayoutContainer.getId = () => getId('layout-container')

export default LayoutContainer
