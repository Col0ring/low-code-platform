import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { getId } from '@/utils'
import { ComponentRenderNode, NodeComponent } from '../../../type'
import { getComponentNode } from '..'
import BlankContent from '../../blank-content'
import { useEditorContext } from '../../../provider'
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
}) => {
  const [, { updateComponentNode }] = useEditorContext()

  const {
    props: { children, spans },
  } = node
  const ColSpanArr = useMemo(() => parseSpan(spans), [spans])
  return (
    <Row>
      {ColSpanArr &&
        ColSpanArr.map((span, index) => {
          const child = children[index]
          return (
            <Col span={span} key={child?.id || index}>
              {child ? (
                <NodeContainer
                  key={child.id}
                  node={child}
                  parentNodes={parentNodes}
                  immerNode={immerNode.props.children[index]}
                />
              ) : (
                <BlankContent
                  onDrop={({ name }) => {
                    const { component, ...rest } = getComponentNode(name)
                    void updateComponentNode(() => {
                      immerNode.props.children[index] = {
                        ...rest,
                        id: component.getId(),
                        props: component.getInitialProps(),
                      }
                    })
                  }}
                />
              )}
            </Col>
          )
        })}
    </Row>
  )
}

LayoutContainer.getInitialProps = () => ({
  children: [],
  spans: '8:8:8',
})
LayoutContainer.getId = () => getId('layout-container')

export default LayoutContainer
