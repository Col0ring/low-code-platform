import React, { useState } from 'react'
import { Form, Input, Modal, ModalProps, Select, Switch, Tabs } from 'antd'
import './style.less'
export interface ActionModalProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modalProps?: ModalProps
}
const ActionModal: React.FC<ActionModalProps> = ({
  modalProps,
  children,
  onClick,
  ...props
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <div
        {...props}
        onClick={(e) => {
          setVisible(true)
          onClick?.(e)
        }}
      >
        {children}
      </div>
      <Modal
        style={{ top: 50 }}
        bodyStyle={{ padding: 10, height: 500 }}
        width={930}
        onCancel={() => setVisible(false)}
        okButtonProps={{ size: 'middle' }}
        cancelButtonProps={{ size: 'middle' }}
        visible={visible}
        closable
        {...modalProps}
      >
        <Form size="middle">
          <Tabs
            className="action-modal-tabs"
            tabPosition="left"
            size="small"
            animated={false}
          >
            <Tabs.TabPane key="internal" tab="内置动作">
              <Tabs tabPosition="left" size="small" animated={false}>
                <Tabs.TabPane key="openUrl" tab="打开 URL">
                  <Form.Item
                    name={['internal', 'openUrl', 'url']}
                    label="网站地址"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={['internal', 'openUrl', 'openInNewTab']}
                    label="新开页面"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name={['internal', 'openUrl', 'openInNewWindow']}
                    label="外部链接"
                  >
                    <Switch />
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane key="openModal" tab="打开弹窗">
                  <Form.Item
                    name={['internal', 'openModal', 'modalId']}
                    label="目标"
                  >
                    <Select />
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane key="closeModal" tab="打开弹窗">
                  <Form.Item
                    label="目标"
                    name={['internal', 'closeModal', 'modalId']}
                  >
                    <Select />
                  </Form.Item>
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
            <Tabs.TabPane key="js" tab="页面 JS">
              <Tabs tabPosition="left" size="small" animated={false}>
                <Tabs.TabPane key="add-action" tab="添加新动作">
                  添加新动作
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </>
  )
}

export default ActionModal
