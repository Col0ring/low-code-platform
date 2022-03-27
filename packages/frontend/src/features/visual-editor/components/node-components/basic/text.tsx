import React from 'react'
import { NodeComponent } from '../../../type'

const Text: NodeComponent = () => {
  return <p>text</p>
}

Text.getInitialProps = () => ({})

export default Text
