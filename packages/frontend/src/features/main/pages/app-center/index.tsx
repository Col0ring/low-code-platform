import {
  Button,
  Card,
  Pagination,
  Tag,
  Dropdown,
  Input,
  Row,
  Col,
  Menu,
  Form,
  Spin,
  Empty,
  Modal,
  message,
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Path } from '@/router/constants'
import { isResolved, mergeBaseUrl, stopPropagation } from '@/utils'
import DefaultAppIcon from '../../components/default-app-icon'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import {
  useCreateAppByTemplateMutation,
  useCreateAppMutation,
  useDeleteAppMutation,
  useGetAppListQuery,
} from '@/features/app/app.service'
import { SearchAppStatus, AppStatus } from '../../constants'
import ImageUploader from '@/features/upload/components/image-uploader'

const appStatus = {
  [SearchAppStatus.All]: '全部状态',
  [SearchAppStatus.Active]: '已启用',
  [SearchAppStatus.Inactive]: '未启用',
}

const appStatusArr = [
  SearchAppStatus.All,
  SearchAppStatus.Active,
  SearchAppStatus.Inactive,
]

const AppCenterPage: React.FC = () => {
  const navigate = useNavigate()
  const [createBlankForm] = Form.useForm()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchOrder, setSearchOrder] = useState<'update' | 'create'>('update')
  const [searchStatus, setSearchStatus] = useState<SearchAppStatus>(
    SearchAppStatus.All
  )
  const [pageSize, setPageSize] = useState(12)
  const [reqCreateApp] = useCreateAppMutation()
  const [reqDeleteApp] = useDeleteAppMutation()
  const [reqCreateAppByTemplate] = useCreateAppByTemplateMutation()
  const [createAppByTemplateForm] = Form.useForm()

  const { data: { data, count } = { data: [], count: 0 }, isFetching } =
    useGetAppListQuery({
      page,
      pageSize,
      searchOptions: {
        search,
        searchOrder,
        searchStatus,
      },
    })
  return (
    <div className="flex-1">
      <div className="flex justify-end p-4 bg-gray-100">
        <Button type="primary" onClick={() => navigate(Path.TemplatesCenter)}>
          从模板创建应用
        </Button>
        <ModalButton
          modal={
            <Form layout="vertical" form={createBlankForm} preserve={false}>
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
          }
          modalTitle="创建应用"
          onModalOK={async () => {
            const values = await createBlankForm.validateFields()
            const res = await reqCreateApp(values)
            if (isResolved(res)) {
              void message.success('创建成功')
              return
            }
            return Promise.reject()
          }}
          className="ml-5"
        >
          创建空白应用
        </ModalButton>
      </div>
      <Spin spinning={isFetching}>
        <div className="px-4 py-3">
          <div className="flex justify-between items-center py-2">
            <Input.Search
              onSearch={setSearch}
              placeholder="请输入应用名称"
              className="w-320px"
              allowClear
            />
            <div className="text-gray-400">
              <Dropdown
                trigger={['click', 'hover']}
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => setSearchOrder('create')}>
                      按创建时间排序
                    </Menu.Item>
                    <Menu.Item onClick={() => setSearchOrder('update')}>
                      按更新时间排序
                    </Menu.Item>
                  </Menu>
                }
              >
                <span>
                  {searchOrder === 'create'
                    ? '按创建时间排序'
                    : '按更新时间排序'}{' '}
                  <DownOutlined />
                </span>
              </Dropdown>
              <Dropdown
                trigger={['click', 'hover']}
                overlay={
                  <Menu>
                    {appStatusArr.map((status) => (
                      <Menu.Item
                        key={status}
                        onClick={() => setSearchStatus(status)}
                      >
                        {appStatus[status]}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <span className="ml-8">
                  {appStatus[searchStatus]} <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div>
          {count === 0 ? (
            <Empty className="mt-200px" description="没有搜索到应用" />
          ) : (
            <div>
              <Row gutter={[15, 15]} className="mt-4">
                {data.map((app) => (
                  <Col key={app.id} span={6}>
                    <Card
                      hoverable
                      onClick={() => {
                        navigate(Path.AppPage(app.id))
                      }}
                    >
                      <div className="flex items-center">
                        <DefaultAppIcon src={app.icon} size={44} />
                        <div className="text-lg ml-3">{app.name}</div>
                      </div>
                      <div className="text-gray-500 mt-5">{app.desc}</div>
                      <div className="flex items-center justify-between mt-5">
                        <Tag
                          color={
                            app.status === AppStatus.Active
                              ? 'success'
                              : 'error'
                          }
                        >
                          {app.status === AppStatus.Active
                            ? '已启用'
                            : '未启用'}
                        </Tag>
                        <div onClick={stopPropagation}>
                          <Dropdown.Button
                            size="small"
                            trigger={['click', 'hover']}
                            overlay={
                              <Menu>
                                <Menu.Item
                                  onClick={() =>
                                    navigate(Path.AppBasicSetting(app.id))
                                  }
                                >
                                  应用设置
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    window.open(
                                      mergeBaseUrl(`/views/apps/${app.id}`),
                                      '_blank'
                                    )
                                  }
                                >
                                  访问应用
                                </Menu.Item>
                                <Menu.Item>
                                  <ModalButton
                                    modal={
                                      <Form
                                        layout="vertical"
                                        form={createAppByTemplateForm}
                                        preserve={false}
                                      >
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
                                    }
                                    modalTitle="应用"
                                    onModalOK={async () => {
                                      const values =
                                        await createAppByTemplateForm.validateFields()
                                      const res = await reqCreateAppByTemplate({
                                        ...values,
                                        templateAppId: app.id,
                                      })
                                      if (isResolved(res)) {
                                        void message.success(
                                          `已成功复制应用${app.name}`
                                        )
                                        return
                                      }
                                      return Promise.reject()
                                    }}
                                    renderButton={(props) => (
                                      <span {...props}>复制应用</span>
                                    )}
                                  />
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    Modal.confirm({
                                      title: '删除应用',
                                      content: `确定删除应用${app.name}吗？`,
                                      onOk: async () => {
                                        const res = await reqDeleteApp(app.id)
                                        if (isResolved(res)) {
                                          void message.success('删除成功')
                                          return
                                        }
                                        return Promise.reject()
                                      },
                                    })
                                  }}
                                >
                                  <span className="text-red-500">删除应用</span>
                                </Menu.Item>
                              </Menu>
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-6 flex justify-center">
                <Pagination
                  total={count}
                  current={page}
                  pageSize={pageSize}
                  onChange={(p, ps) => {
                    setPage(p)
                    setPageSize(ps)
                  }}
                  hideOnSinglePage
                  pageSizeOptions={[8, 12, 16, 24, 36]}
                />
              </div>
            </div>
          )}
        </div>
      </Spin>
    </div>
  )
}

export default AppCenterPage
