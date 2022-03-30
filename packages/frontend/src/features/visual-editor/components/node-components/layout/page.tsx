import React, { useMemo } from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { useEditorContext } from '../../../provider'
import { getComponentNode } from '..'
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
  return (
    <div className="w-full h-full" style={pageStyle}>
      {children.length === 0 ? (
        <BlankContent
          onDrop={({ name }) => {
            const { component, title } = getComponentNode(name)
            void updateComponentNode(() => {
              const newNode = {
                title,
                name,
                id: component.getId(),
                props: component.getInitialProps(),
              }
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
              key={child.id}
              node={child}
              parentNodes={parentNodes}
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
