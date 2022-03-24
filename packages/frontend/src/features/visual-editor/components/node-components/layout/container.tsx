import React from 'react'
import BlankContent from '../../blank-content'
import { ComponentNodeProps } from '../../../type'

const Container: React.FC<ComponentNodeProps> = ({ node }) => {
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

export default Container
