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
  renderButton?: (props: ButtonProps) => React.ReactNode
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
  renderButton,
  ...buttonProps
}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      {renderButton ? (
        renderButton({
          ...buttonProps,
          onClick: (e) => {
            setVisible(true)
            buttonProps.onClick?.(e)
          },
        })
      ) : (
        <Button
          {...buttonProps}
          onClick={(e) => {
            setVisible(true)
            buttonProps.onClick?.(e)
          }}
        />
      )}
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
              loading={loading}
              {...modalCancelButtonProps}
            >
              取消
            </Button>
          ) : null,
          <Button
            onClick={async () => {
              try {
                setLoading(true)
                await onModalOK?.()
                setVisible(false)
              } catch (error) {
                // reject
                console.warn(error)
              }
              setLoading(false)
            }}
            type="primary"
            key="ok"
            loading={loading}
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
