import React from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { useEditorContext } from '../../../provider'
import { getComponentNode } from '..'
import { getId } from '@/utils'
import NodeContainer from '../../node-container'

export interface LayoutProps {
  children: ComponentRenderNode[]
}

const Layout: NodeComponent<LayoutProps> = ({
  node,
  immerNode,
  parentNodes,
}) => {
  const [, { updateComponentNode }] = useEditorContext()
  const {
    props: { children },
  } = node
  return (
    <div>
      {children.length === 0 ? (
        <BlankContent
          onDrop={({ name }) => {
            const { component, title } = getComponentNode(name)
            void updateComponentNode(() => {
              immerNode.props.children.push({
                title,
                name,
                id: component.getId(),
                props: component.getInitialProps(),
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

Layout.getInitialProps = () => ({
  children: [],
})

Layout.getId = () => getId('layout')

export default Layout
