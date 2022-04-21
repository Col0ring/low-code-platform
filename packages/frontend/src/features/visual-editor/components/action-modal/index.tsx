import React, { useEffect, useMemo, useState } from 'react'
import {
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Select,
  Switch,
  Tabs,
} from 'antd'
import './style.less'
import { Action } from '../../type'
import { useEditorPreviewContext } from '../editor-preview/provider'
import { MonacoEditor } from '@/components/monaco-editor'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import { useEditorContext } from '../../provider'
export interface ActionModalProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modalProps?: ModalProps
  onOk?: (values: Action) => void
  action?: Action
}
const ActionModal: React.FC<ActionModalProps> = ({
  modalProps,
  children,
  onClick,
  onOk,
  action,
  ...props
}) => {
  const {
    actionEvent: actionEventProp = 'openUrl',
    actionType: actionTypeProp = 'internal',
    value: valueProp,
  } = action || {}
  const [actionType, setActionType] = useState<'internal' | 'js'>(
    actionTypeProp
  )
  const [actionEvent, setActionEvent] = useState(actionEventProp)
  const [search, setSearch] = useState('')
  const [{ page }, { updatePageData }] = useEditorContext()
  const {
    actions: { js },
  } = useEditorPreviewContext()
  const jsActions = useMemo(
    () => Object.keys(js).map((k) => ({ name: k, action: js[k] })),
    [js]
  )
  const [form] = Form.useForm()
  const [newActionForm] = Form.useForm()
  const searchJsActions = useMemo(
    () =>
      jsActions.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, jsActions]
  )

  useEffect(() => {
    if (actionType === 'internal') {
      setActionEvent('openUrl')
    } else {
      setActionEvent(searchJsActions[0]?.name)
    }
  }, [actionType, searchJsActions])

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
        destroyOnClose
        style={{ top: 50 }}
        bodyStyle={{ padding: 10, height: 500 }}
        width={930}
        onCancel={() => setVisible(false)}
        onOk={() => {
          const values = form.getFieldsValue()
          onOk?.({
            actionType,
            actionEvent,
            value:
              actionType === 'js'
                ? values[actionType][actionEvent] || '{}'
                : values[actionType][actionEvent],
          })
          setVisible(false)
        }}
        okButtonProps={{ size: 'middle' }}
        cancelButtonProps={{ size: 'middle' }}
        visible={visible}
        closable
        {...modalProps}
      >
        <Form
          initialValues={{
            [actionType]: {
              [actionEvent]: valueProp,
            },
          }}
          size="middle"
          form={form}
          preserve={false}
        >
          <Tabs
            activeKey={actionType}
            onChange={(activeKey) =>
              setActionType(activeKey as 'internal' | 'js')
            }
            className="action-modal-tabs"
            tabPosition="left"
            size="small"
            animated={false}
          >
            <Tabs.TabPane key="internal" tab="内置动作">
              <Tabs
                activeKey={actionEvent}
                onChange={setActionEvent}
                tabPosition="left"
                size="small"
                animated={false}
              >
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
                    valuePropName="checked"
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
              <div className="m-2 flex items-center">
                <Input.Search allowClear onSearch={setSearch} />
                <ModalButton
                  modalTitle="添加新动作"
                  modal={
                    <Form form={newActionForm} preserve={false}>
                      <Form.Item
                        label="动作名"
                        name="name"
                        rules={[emptyValidator('动作名')]}
                      >
                        <Input />
                      </Form.Item>
                    </Form>
                  }
                  onModalOK={async () => {
                    const { name } = await newActionForm.validateFields()
                    if (js[name]) {
                      void message.error(`动作 ${name} 已存在`)
                      return Promise.reject()
                    }
                    updatePageData({
                      js: `${page.js}\n\nexport const ${name} = (value, e) => {}`,
                    })
                    void message.success(`动作 ${name} 创建成功`)
                  }}
                  className="ml-2"
                  type="primary"
                >
                  添加新动作
                </ModalButton>
              </div>
              <Tabs
                activeKey={actionEvent}
                onChange={setActionEvent}
                tabPosition="left"
                size="small"
                animated={false}
              >
                {searchJsActions.map(({ name }) => {
                  return (
                    <Tabs.TabPane key={name} tab={name}>
                      <Form.Item label="参数" name={['js', name]}>
                        <MonacoEditor
                          style={{ height: 400 }}
                          className="border"
                          language="json"
                          defaultValue={'{}'}
                          minimap={{ enabled: false }}
                        />
                      </Form.Item>
                    </Tabs.TabPane>
                  )
                })}
              </Tabs>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </>
  )
}

export default ActionModal
