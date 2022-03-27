import React from 'react'
import BlankContent from '../../blank-content'
import { NodeComponent, ComponentRenderNode } from '../../../type'

export interface ContainerProps {
  children: ComponentRenderNode[]
}

const Container: NodeComponent = ({ node }) => {
  const { props } = node
  return (
    <>
      <BlankContent
        onDrop={(data) => {
          console.log(data)
        }}
      />
    </>
  )
}

Container.getInitialProps = () => ({})

export default Container
