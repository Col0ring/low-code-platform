import React from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'
import { useEditorContext } from '../../../provider'
import { getComponentNode } from '..'

export interface ContainerProps {
  children: ComponentRenderNode[]
}

const Container: NodeComponent<ContainerProps> = ({ node, immerNode }) => {
  const [{ immerComponentNodes }, { updateComponentNode }] = useEditorContext()
  const { props } = node
  return (
    <div>
      <BlankContent
        onDrop={({ name }) => {
          const { component, ...rest } = getComponentNode(name)
          void updateComponentNode(() => {
            immerNode.props.children.push({
              ...rest,
              props: component.getInitialProps(),
            })
          })
        }}
      />
      {props.children.map((child, index) => {
        return React.createElement(getComponentNode(child.name).component, {
          // TODO: key uuid
          key: index,
          node: child,
          immerNode: immerNode.props.children[index],
        })
      })}
    </div>
  )
}

Container.getInitialProps = () => ({
  children: [],
})

export default Container
