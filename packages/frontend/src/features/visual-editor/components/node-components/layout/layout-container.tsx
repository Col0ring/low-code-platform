import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { getId } from '@/utils'
import { ComponentRenderNode, NodeComponent } from '../../../type'
import { createNewNode } from '..'
import NodeContainer from '../../node-container'

function parseSpan(spans: string) {
  const res = spans.split(':').map(Number)
  if (res.some((v) => Number.isNaN(v))) {
    return null
  }
  return res
}

export interface LayoutContainerProps {
  children: ComponentRenderNode[]
  spans: string
}

const LayoutContainer: NodeComponent<LayoutContainerProps> = ({
  node,
  immerNode,
  parentNodes,
  disabled,
}) => {
  const {
    props: { children, spans },
  } = node
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  const ColSpanArr = useMemo(() => parseSpan(spans), [spans])
  return (
    <Row>
      {ColSpanArr &&
        ColSpanArr.map((span, index) => {
          const child = children[index]
          return (
            <Col span={span} key={child.id}>
              <NodeContainer
                disabled={disabled}
                immerParentNode={null}
                index={index}
                key={child.id}
                node={child}
                parentNodes={childParentNodes}
                immerNode={immerNode.props.children[index]}
              />
            </Col>
          )
        })}
    </Row>
  )
}

LayoutContainer.getInitialProps = () => ({
  children: [
    createNewNode('layout'),
    createNewNode('layout'),
    createNewNode('layout'),
  ],
  spans: '8:8:8',
})
LayoutContainer.getId = () => getId('layout-container')
LayoutContainer.disabledChildAction = true
export default LayoutContainer
