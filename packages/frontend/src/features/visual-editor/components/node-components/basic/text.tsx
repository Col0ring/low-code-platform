import { getId } from '@/utils'
import React from 'react'
import { NodeComponent } from '../../../type'

const Text: NodeComponent = () => {
  return <p style={{ lineHeight: 1 }}>text</p>
}

Text.nodeName = 'text'
Text.title = '文本'
Text.getInitialProps = () => ({})
Text.getId = () => getId('text')
export default Text
