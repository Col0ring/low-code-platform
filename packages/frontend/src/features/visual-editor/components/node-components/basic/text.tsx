import { getId } from '@/utils'
import React from 'react'
import { NodeComponent } from '../../../type'

const Text: NodeComponent = () => {
  return <p style={{ lineHeight: 1 }}>text</p>
}

Text.getInitialProps = () => ({})
Text.getId = () => getId('text')
export default Text
