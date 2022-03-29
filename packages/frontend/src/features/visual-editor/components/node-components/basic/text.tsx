import { getId } from '@/utils'
import React from 'react'
import { NodeComponent } from '../../../type'

const Text: NodeComponent = () => {
  return <p>text</p>
}

Text.getInitialProps = () => ({})
Text.getId = () => getId('text')
export default Text
