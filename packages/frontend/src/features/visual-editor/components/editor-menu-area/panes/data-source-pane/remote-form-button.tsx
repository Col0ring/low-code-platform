import ModalButton from '@/components/modal-button'
import { Form, Input } from 'antd'
import React from 'react'

export interface RemoteFormButtonProps {
  type: 'add' | 'edit'
}
const RemoteFormButton: React.FC<RemoteFormButtonProps> = () => {
  return (
    <ModalButton
      modal={
        <Form>
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>
      }
      renderButton={(props) => <div {...props}>远程</div>}
      modalTitle="新增远程 API"
    />
  )
}

export default RemoteFormButton
