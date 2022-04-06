import React, { useState } from 'react'
import { Button, ButtonProps, Modal, ModalProps } from 'antd'

export interface ModalButtonProps extends ButtonProps {
  modal: React.ReactNode
  modalTitle?: React.ReactNode
  showCancelButton?: boolean
  onModalCancel?: () => void
  onModalOK?: () => Promise<void> | void
  modalOkButtonProps?: ButtonProps
  modalCancelButtonProps?: ButtonProps
  afterModalClose?: () => void
  modalProps?: ModalProps
}

const ModalButton: React.FC<ModalButtonProps> = ({
  modal,
  modalTitle,
  afterModalClose,
  showCancelButton = true,
  onModalCancel,
  modalOkButtonProps,
  modalCancelButtonProps,
  onModalOK,
  modalProps,
  ...buttonProps
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        {...buttonProps}
        onClick={(e) => {
          setVisible(true)
          buttonProps.onClick?.(e)
        }}
      />
      <Modal
        {...modalProps}
        destroyOnClose
        title={modalTitle}
        visible={visible}
        afterClose={afterModalClose}
        onCancel={() => {
          onModalCancel?.()
          setVisible(false)
        }}
        footer={[
          showCancelButton ? (
            <Button
              onClick={() => {
                onModalCancel?.()
                setVisible(false)
              }}
              key="cancel"
              {...modalCancelButtonProps}
            >
              取消
            </Button>
          ) : null,
          <Button
            onClick={async () => {
              try {
                await onModalOK?.()
                setVisible(false)
              } catch (error) {
                // reject
                console.warn(error)
              }
            }}
            type="primary"
            key="ok"
            {...modalOkButtonProps}
          >
            确定
          </Button>,
        ]}
      >
        {modal}
      </Modal>
    </>
  )
}

export default ModalButton
