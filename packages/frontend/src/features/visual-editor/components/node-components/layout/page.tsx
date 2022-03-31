import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { useEditorContext } from '../../../provider'
import { createNewNode } from '..'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface PageProps {
  children: ComponentRenderNode[]
}

const Page: NodeComponent<PageProps> = ({ node, immerNode, parentNodes }) => {
  const [, { updateComponentNode, setEditorState }] = useEditorContext()

  const {
    props: { children },
  } = node
  const pageStyle = useMemo(
    () =>
      children.length === 0
        ? { width: 300, height: 750 }
        : { width: 300, minHeight: 750 },
    [children.length]
  )
  const childParentNodes = useMemo(
    () => [...parentNodes, node],
    [parentNodes, node]
  )
  return (
    <div style={pageStyle}>
      {children.length === 0 ? (
        <BlankContent
          onDrop={({ name }) => {
            void updateComponentNode(() => {
              const newNode = createNewNode(name)
              immerNode.props.children.push(newNode)
              setEditorState({
                actionNode: newNode,
              })
            })
          }}
        />
      ) : (
        children.map((child, index) => {
          return (
            <NodeContainer
              immerParentNode={immerNode}
              index={index}
              key={child.id}
              node={child}
              parentNodes={childParentNodes}
              immerNode={immerNode.props.children[index]}
            />
          )
        })
      )}
    </div>
  )
}

Page.getInitialProps = () => ({
  children: [],
})

Page.getId = () => getId('page')

export default Page
