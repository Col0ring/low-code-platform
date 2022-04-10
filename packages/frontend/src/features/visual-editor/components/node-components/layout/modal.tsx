import React from 'react'
import { Modal as AntdModal } from 'antd'
import { NodeComponent } from '@/features/visual-editor/type'
import { useEditorContext } from '@/features/visual-editor/provider'
import { renderNodes } from '..'
import { useMount } from '@/hooks'

const Modal: NodeComponent = ({ editType, node }) => {
  const { children } = node
  const [, { updateComponentNode }] = useEditorContext()
  useMount(() => {
    if (editType === 'prod') {
      //
    }
  })
  if (editType === 'prod') {
    return <AntdModal>{renderNodes(children)}</AntdModal>
  }
  return <AntdModal visible={false}>11</AntdModal>
}

export default Modal
