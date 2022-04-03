import React, { useMemo, useEffect } from 'react'
import { Row, Col } from 'antd'
import { getId } from '@/utils'
import { NodeComponent } from '../../../type'
import { createNewNode } from '..'
import NodeContainer from '../../node-container'
import { useEditorContext } from '@/features/visual-editor/provider'
import Layout from './layout'

const layoutName = Layout.nodeName

function parseSpan(spans: string) {
  const res = spans.split(':').map(Number)
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
}) => {
  const {
    children,
    props: { spans },
  } = node
  const [, { updateComponentNode }] = useEditorContext()
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  const ColSpanArr = useMemo(() => parseSpan(spans), [spans])
  useEffect(() => {
    if (ColSpanArr) {
      if (ColSpanArr.length !== children.length) {
        const extraChildren =
          ColSpanArr.length > children.length
            ? new Array(ColSpanArr.length - children.length)
                .fill(0)
                .map(() => createNewNode(layoutName))
            : []
        updateComponentNode({
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
  }, [node.children, ColSpanArr, children.length, updateComponentNode, node])
  return (
    <Row>
      {ColSpanArr &&
        ColSpanArr.map((span, index) => {
          const child = children[index]
          return (
            <Col span={span} key={child.id || index}>
              {child && (
                <NodeContainer
                  disabled={disabled}
                  draggable={false}
                  index={index}
                  key={child.id}
                  node={child}
                  parentNodes={childParentNodes}
                />
              )}
            </Col>
          )
        })}
    </Row>
  )
}
LayoutContainer.nodeName = 'layout-container'
LayoutContainer.title = '布局容器'
LayoutContainer.getInitialProps = () => ({
  spans: '8:8:8',
})
LayoutContainer.getInitialChildren = () => [
  createNewNode(layoutName),
  createNewNode(layoutName),
  createNewNode(layoutName),
]
LayoutContainer.getId = () => getId('layout-container')
export default LayoutContainer
