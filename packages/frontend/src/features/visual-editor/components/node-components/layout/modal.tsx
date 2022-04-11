import React from 'react'
import { Modal as AntdModal } from 'antd'
import { NodeComponent } from '@/features/visual-editor/type'
import { useEditorContext } from '@/features/visual-editor/provider'
import { renderNodes } from '..'
import { useMount } from '@/hooks'
import { getId } from '@/utils'

export interface ModalProps {
  title: string
}

const Modal: NodeComponent<ModalProps> = ({ editType, node }) => {
  const { children } = node
  const [, { updateComponentNode }] = useEditorContext(false) || [{}, {}]
  useMount(() => {
    if (editType === 'edit') {
      //
    }
  })
  if (editType === 'prod') {
    return <AntdModal>{renderNodes(children)}</AntdModal>
  }
  return <AntdModal visible={false}>11</AntdModal>
}

Modal.nodeName = 'modal'
Modal.title = '弹框'
Modal.getId = () => getId('modal')
Modal.getInitialChildren = () => []
Modal.getInitialStyle = () => ({})
Modal.getInitialProps = () => ({ title: '' })

export default Modal
