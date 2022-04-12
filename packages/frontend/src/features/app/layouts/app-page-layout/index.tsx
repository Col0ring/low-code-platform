import MenuLayout, { MenuLayoutItemProps } from '@/components/menu-layout'
import React, { useEffect, useState, useMemo } from 'react'
import {
  AutoComplete,
  AutoCompleteProps,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Space,
} from 'antd'
import {
  PlusOutlined,
  ContainerOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Path } from '@/router/constants'
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router'
import { App } from '@/features/main/type'
import { Page } from '../../type'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useUpdatePageMutation,
} from '../../app.service'
import { isResolved, stopPropagation } from '@/utils'
import { ArrayItem } from 'types-kit'

interface PageHoverItemProps {
  pageId: number
  appId: number
  menu: MenuLayoutItemProps
}
const PageHoverItem: React.FC<PageHoverItemProps> = ({
  children,
  pageId,
  appId,
  menu,
}) => {
  const page = menu.page as Page
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const [reqDeletePage] = useDeletePageMutation()
  const [reqUpdatePage] = useUpdatePageMutation()
  const [updatePageForm] = Form.useForm()
  return (
    <div
      onClick={stopPropagation}
      className="w-full flex items-center justify-between"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className="flex-1"
        onClick={(e) => {
          e.stopPropagation()
          navigate(menu.path)
        }}
      >
        {children}
      </div>
      {visible && (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="change">
                <ModalButton
                  modalTitle={menu.title}
                  modal={
                    <Form
                      form={updatePageForm}
                      preserve={false}
                      initialValues={{
                        name: page.name,
                        path: page.path,
                      }}
                    >
                      <Form.Item
                        label="页面名称"
                        name="name"
                        rules={[emptyValidator('页面名称')]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="页面路径"
                        name="path"
                        rules={[emptyValidator('页面路径')]}
                      >
                        <Input />
                      </Form.Item>
                    </Form>
                  }
                  onModalOK={async () => {
                    const values = await updatePageForm.validateFields()
                    const res = await reqUpdatePage({
                      data: values,
                      pageId,
                      appId: +appId,
                    })
                    if (isResolved(res)) {
                      void message.success('修改成功')
                      return
                    }
                    return Promise.reject()
                  }}
                  renderButton={(props) => <span {...props}>修改</span>}
                />
              </Menu.Item>
              <Menu.Item key="copy">复制</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                key="delete"
                className="text-red-500"
                onClick={() => {
                  Modal.confirm({
                    title: '删除页面',
                    content: `确认删除页面${menu.title}吗？`,
                    async onOk() {
                      const res = await reqDeletePage({ pageId, appId })
                      if (isResolved(res)) {
                        void message.success('删除成功')
                        return
                      }

                      return Promise.reject()
                    },
                  })
                }}
              >
                删除
              </Menu.Item>
            </Menu>
          }
        >
          <SettingOutlined />
        </Dropdown>
      )}
    </div>
  )
}

const AppPageLayout: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { appId } = useParams() as { appId: string }
  const { pages } = useOutletContext<
    App & {
      pages: Page[]
    }
  >()
  const pageMenus = useMemo(
    () =>
      pages.map((page) => ({
        id: page.id,
        icon: <ContainerOutlined className="text-yellow-500" />,
        page,
        title: page.name,
        path: Path.AppPageDetail(appId, `${page.id}`),
        key: Path.AppPageDetail(appId, `${page.id}`),
      })),
    [appId, pages]
  )
  const menuOptions = useMemo(
    () =>
      pageMenus.map((page) => ({
        value: page.path,
        label: page.title,
      })),
    [pageMenus]
  )
  const [options, setOptions] =
    useState<AutoCompleteProps['options']>(menuOptions)
  const [createPageForm] = Form.useForm()
  const [reqCreatePage] = useCreatePageMutation()
  useEffect(() => {
    setOptions(menuOptions)
  }, [menuOptions])
  return (
    <MenuLayout
      extra={
        <div className="w-full flex px-3 pb-3">
          <AutoComplete
            allowClear
            placeholder="搜索"
            className="flex-1"
            onSelect={(
              value: string,
              { label }: ArrayItem<NonNullable<AutoCompleteProps['options']>>
            ) => {
              setSearch(label as string)
              navigate(value)
            }}
            onSearch={(value) => {
              setOptions(
                menuOptions.filter((menuOption) =>
                  menuOption.label.includes(value)
                )
              )
            }}
            value={search}
            onChange={setSearch}
            options={options}
          />
          <ModalButton
            modalTitle="新增页面"
            modal={
              <Form form={createPageForm} preserve={false}>
                <Form.Item
                  label="页面名称"
                  name="name"
                  rules={[emptyValidator('页面名称')]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="页面路径"
                  name="path"
                  rules={[emptyValidator('页面路径')]}
                >
                  <Input />
                </Form.Item>
              </Form>
            }
            onModalOK={async () => {
              const values = await createPageForm.validateFields()
              const res = await reqCreatePage({ ...values, appId: +appId })
              if (isResolved(res)) {
                void message.success('添加成功')
                navigate(Path.AppPageDetail(appId, `${res.data.id}`))
                return
              }
              return Promise.reject()
            }}
            className="ml-2 flex-shrink-0"
            type="primary"
            icon={<PlusOutlined />}
          />
        </div>
      }
      menus={pageMenus}
      render={(_, menu) => {
        return (
          <PageHoverItem pageId={+menu.id} appId={+appId} menu={menu}>
            <Space>
              {menu.icon}
              {menu.title}
            </Space>
          </PageHoverItem>
        )
      }}
    >
      <Outlet />
    </MenuLayout>
  )
}

export default AppPageLayout
