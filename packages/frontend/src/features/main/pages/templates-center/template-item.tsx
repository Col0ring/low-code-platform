import {
  useCreateAppByTemplateMutation,
  useDeleteAppMutation,
  useGetAppDetailQuery,
} from '@/features/app/app.service'
import RouteLoading from '@/router/route-loading'
import { Button, Card, Form, Input, message, Modal, Menu, Dropdown } from 'antd'
import React, { useState } from 'react'
import DefaultAppIcon from '../../components/default-app-icon'
import { Template } from '../../type'
import { isResolved, stopPropagation } from '@/utils'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import { mainApi, useUpdateTemplateMutation } from '../../main.service'
import { useAppDispatch } from '@/store'
import AppView from '@/features/app/pages/app-view'
import ImageUploader from '@/features/upload/components/image-uploader'

export interface TemplateModalProps {
  template: Template
  self?: boolean
}

const TemplateItem: React.FC<TemplateModalProps> = ({ template, self }) => {
  const [visible, setVisible] = useState(false)
  const { data } = useGetAppDetailQuery(template.app.id)
  const dispatch = useAppDispatch()
  const [reqDeleteApp] = useDeleteAppMutation()
  const [reqCreateAppByTemplate] = useCreateAppByTemplateMutation()
  const [reqUpdateAppByTemplate] = useUpdateTemplateMutation()
  const [templateForm] = Form.useForm()
  const [editTemplateForm] = Form.useForm()

  const TemplateForm = (
    <Form layout="vertical" form={templateForm} preserve={false}>
      <Form.Item
        label="应用名称"
        name="name"
        rules={[emptyValidator('应用名称')]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="应用图标" name="icon">
        <ImageUploader />
      </Form.Item>
      <Form.Item label="应用描述" name="desc">
        <Input.TextArea />
      </Form.Item>
    </Form>
  )

  const EditTemplateForm = (
    <Form
      layout="vertical"
      initialValues={template}
      form={editTemplateForm}
      preserve={false}
    >
      <Form.Item
        label="模板名称"
        name="name"
        rules={[emptyValidator('模板名称')]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="模板图标" name="icon">
        <ImageUploader />
      </Form.Item>
      <Form.Item label="模板描述" name="desc">
        <Input.TextArea />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <Card
        hoverable
        onClick={() => {
          setVisible(true)
        }}
      >
        <div className="flex items-center">
          <DefaultAppIcon size={44} src={template.icon} />
          <div className="text-lg ml-3">{template.name}</div>
        </div>
        <div className="text-gray-500 mt-5">{template.desc}</div>
        <div onClick={stopPropagation} className="mt-5 flex justify-end">
          <Dropdown.Button
            size="small"
            trigger={['click', 'hover']}
            overlay={
              <Menu>
                <Menu.Item>
                  <ModalButton
                    modal={TemplateForm}
                    modalTitle="创建应用"
                    onModalOK={async () => {
                      const values = await templateForm.validateFields()
                      const res = await reqCreateAppByTemplate({
                        ...values,
                        templateAppId: template.app.id,
                      })
                      if (isResolved(res)) {
                        void message.success('创建成功')
                        return
                      }
                      return Promise.reject()
                    }}
                    renderButton={(props) => <span {...props}>应用此模板</span>}
                  />
                </Menu.Item>
                {self && (
                  <>
                    <Menu.Item>
                      <ModalButton
                        modal={EditTemplateForm}
                        modalTitle="编辑模板"
                        onModalOK={async () => {
                          const values = await editTemplateForm.validateFields()
                          const res = await reqUpdateAppByTemplate({
                            ...values,
                            templateId: template.id,
                          })
                          if (isResolved(res)) {
                            void message.success('修改成功')
                            return
                          }
                          return Promise.reject()
                        }}
                        renderButton={(props) => (
                          <span {...props}>编辑模板</span>
                        )}
                      />
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        Modal.confirm({
                          title: '删除模板',
                          content: `确定删除模板${template.name}吗？`,
                          onOk: async () => {
                            const res = await reqDeleteApp(template.app.id)

                            if (isResolved(res)) {
                              void message.success('删除成功')
                              dispatch(
                                mainApi.util.invalidateTags(['Template'])
                              )
                              return
                            }
                            return Promise.reject()
                          },
                        })
                      }}
                    >
                      <span className="text-red-500">删除模板</span>
                    </Menu.Item>
                  </>
                )}
              </Menu>
            }
          />
        </div>
      </Card>
      <Modal
        style={{ top: 30 }}
        width="100vw"
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        title={template.name}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <ModalButton
            key="ok"
            modal={TemplateForm}
            modalTitle="创建应用"
            onModalOK={async () => {
              const values = await templateForm.validateFields()
              const res = await reqCreateAppByTemplate({
                ...values,
                templateAppId: template.app.id,
              })
              if (isResolved(res)) {
                void message.success('创建成功')
                setVisible(false)
                return
              }
              return Promise.reject()
            }}
            className="ml-5"
          >
            应用此模板
          </ModalButton>,
        ]}
      >
        {data ? (
          <AppView className="w-full h-500px" appId={data.id} />
        ) : (
          // <Tabs>
          //   {data.pages.map((page) => {
          //     const pageRenderNode = safeJsonParser<PageRenderNode | null>(
          //       page.content,
          //       null
          //     )
          //     return (
          //       <Tabs.TabPane tab={page.name} key={page.id}>
          //         {pageRenderNode ? (
          //           <EditorPreview page={pageRenderNode} />
          //         ) : null}
          //       </Tabs.TabPane>
          //     )
          //   })}
          // </Tabs>
          <RouteLoading />
        )}
      </Modal>
    </>
  )
}

export default TemplateItem
