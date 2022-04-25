import { emptyValidator } from '@/utils/validators'
import { Form, Input, Modal } from 'antd'
import React from 'react'
import { useEditorPropsContext } from '../../editor-props-context'
import { ComponentRenderNode } from '../../type'

export interface BlockModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  node: ComponentRenderNode
}

const BlockModal: React.FC<BlockModalProps> = ({
  visible,
  setVisible,
  node,
}) => {
  const [form] = Form.useForm()
  const { onBlockAdd } = useEditorPropsContext()
  return (
    <Modal
      destroyOnClose
      title="保存为区块"
      onOk={async () => {
        const { name } = await form.validateFields()
        setVisible(false)
        onBlockAdd({ name, content: JSON.stringify(node) })
      }}
      onCancel={() => setVisible(false)}
      visible={visible}
    >
      <Form form={form} preserve={false}>
        <Form.Item
          name="name"
          label="区块名称"
          rules={[emptyValidator('区块名称')]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BlockModal
