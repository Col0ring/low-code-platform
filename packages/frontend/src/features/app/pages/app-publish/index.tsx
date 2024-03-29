import ModalButton from '@/components/modal-button'
import { AppStatus } from '@/features/main/constants'
import { useCreateTemplateMutation } from '@/features/main/main.service'
import { App } from '@/features/main/type'
import ImageUploader from '@/features/upload/components/image-uploader'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { isResolved, mergeBaseUrl } from '@/utils'
import { emptyValidator } from '@/utils/validators'
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  InfoCircleOutlined,
  StopOutlined,
  CopyOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, message, Space, Tooltip } from 'antd'
import React, { useMemo, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { useLazyBuildAppQuery, useUpdateAppMutation } from '../../app.service'

function down(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  // 表示下载的
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.parentNode?.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const AppPublishPage: React.FC = () => {
  const app = useOutletContext<App>()
  const [reqUpdateApp, { isLoading }] = useUpdateAppMutation()
  const [reqBuildApp, { isFetching }] = useLazyBuildAppQuery()
  const [publicPath, setPublishPath] = useState('./')
  const [reqCreateTemplate] = useCreateTemplateMutation()
  const [state, copyToClipboard] = useCopyToClipboard()
  const [createTemplateForm] = Form.useForm()
  const visitUrl = useMemo(
    () => mergeBaseUrl(`/views/apps/${app.id}`),
    [app.id]
  )
  useEffect(() => {
    if (state.value) {
      void message.success('复制成功')
    }
  }, [state])
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-md w-6/7 mt-6">
        <div className="flex items-center justify-between">
          <span
            className={`${
              app.status === AppStatus.Active
                ? 'text-green-500'
                : 'text-gray-400'
            } flex items-center`}
          >
            {React.createElement(
              app.status === AppStatus.Active
                ? CheckCircleFilled
                : InfoCircleOutlined,
              {
                className: 'text-5xl',
              }
            )}
            <span className="text-2xl ml-3">
              {app.status === AppStatus.Active ? '已启用' : '未启用'}
            </span>
          </span>
          <Button
            loading={isLoading}
            onClick={async () => {
              const res = await reqUpdateApp({
                id: app.id,
                status:
                  app.status === AppStatus.Active
                    ? AppStatus.Inactive
                    : AppStatus.Active,
              })
              if (isResolved(res)) {
                void message.success(
                  `已${app.status === AppStatus.Active ? '取消启用' : '启用'}`
                )
              }
            }}
            type={app.status === AppStatus.Active ? 'default' : 'primary'}
            icon={
              app.status === AppStatus.Active ? (
                <StopOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
          >
            {app.status === AppStatus.Active ? '停用' : '启用'}
          </Button>
        </div>
      </div>
      <div className="w-6/7 mt-6">
        <h2 className="font-bold text-lg">访问途径</h2>
        <div className="bg-white p-4 rounded-md mt-4">
          <h3 className="font-bold text-base">生成本地打包应用</h3>
          <div className="mt-4">
            <Input
              value={publicPath}
              onChange={(e) => setPublishPath(e.target.value)}
              placeholder="请输入公共路径"
              prefix={
                <Tooltip title="公共路径，默认是 ./，代表相对路径，可修改为 / 变为服务端路径">
                  <QuestionCircleOutlined />
                </Tooltip>
              }
              className="w-400px mr-2"
            />
            <Button
              loading={isFetching}
              type="primary"
              onClick={async () => {
                const { data } = await reqBuildApp({
                  appId: app.id,
                  publicPath,
                })
                if (data) {
                  let filename = 'dist.zip'
                  const ctx: string = data.contentDisposition
                  if (ctx) {
                    filename = decodeURIComponent(
                      ctx.split(';')[1].split('filename=')[1]
                    )
                  }
                  down(data.url, filename)
                  void message.success('已生成本地打包应用')
                }
              }}
            >
              {isFetching ? '应用打包中' : '打包应用'}
            </Button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md mt-4">
          <h3 className="font-bold text-base">发布为模板</h3>
          <div className="mt-4">
            <ModalButton
              modal={
                <Form
                  layout="vertical"
                  form={createTemplateForm}
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
              }
              modalTitle="创建模板"
              onModalOK={async () => {
                const values = await createTemplateForm.validateFields()
                const res = await reqCreateTemplate({
                  ...values,
                  appId: app.id,
                })
                if (isResolved(res)) {
                  void message.success('发布成功')
                  return
                }
                return Promise.reject()
              }}
              type="primary"
            >
              发布
            </ModalButton>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md mt-4">
          <h3 className="font-bold text-base">在线访问链接</h3>
          <Space className="mt-3">
            <Input value={visitUrl} disabled className="w-400px" />
            <Tooltip title="复制">
              <Button
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(visitUrl)}
              />
            </Tooltip>
            <Tooltip title="访问">
              <Button
                onClick={() => window.open(visitUrl, '_blank')}
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default AppPublishPage
