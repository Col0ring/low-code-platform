import {
  Button,
  Card,
  Modal,
  Pagination,
  Tag,
  Dropdown,
  Input,
  Row,
  Col,
  Menu,
} from 'antd'
import { DownOutlined, AppstoreOutlined } from '@ant-design/icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Path } from '@/router/constants'
import { stopPropagation } from '@/utils'
import DefaultAppIcon from '../../components/default-app-icon'

const AppCenterPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex justify-end p-4 bg-gray-100">
        <Button type="primary" onClick={() => navigate(Path.TemplatesCenter)}>
          从模板创建应用
        </Button>
        <Button className="ml-5">创建空白应用</Button>
      </div>
      <div className="px-4 py-3">
        <div className="flex justify-between items-center py-2">
          <Input.Search
            placeholder="请输入应用名称"
            className="w-320px"
            allowClear
          />
          <div className="text-gray-400">
            <Dropdown
              trigger={['click', 'hover']}
              overlay={
                <Menu>
                  <Menu.Item>按创建时间排序</Menu.Item>
                  <Menu.Item>按更新时间排序</Menu.Item>
                </Menu>
              }
            >
              <span>
                按创建时间排序 <DownOutlined />
              </span>
            </Dropdown>
            <Dropdown
              trigger={['click', 'hover']}
              overlay={
                <Menu>
                  <Menu.Item>全部状态</Menu.Item>
                  <Menu.Item>已启用</Menu.Item>
                  <Menu.Item>未启用</Menu.Item>
                </Menu>
              }
            >
              <span className="ml-8">
                全部状态 <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </div>
        <Row gutter={[15, 15]} className="mt-4">
          <Col span={6}>
            <Card
              hoverable
              onClick={() => {
                navigate(Path.AppPage('2'))
              }}
            >
              <div className="flex items-center">
                <DefaultAppIcon size={44} />
                <div className="text-lg ml-3">title</div>
              </div>
              <div className="text-gray-500 mt-5">desc desc</div>
              <div className="flex items-center justify-between mt-5">
                <Tag color="success">已启用</Tag>
                <div onClick={stopPropagation}>
                  <Dropdown.Button
                    size="small"
                    trigger={['click', 'hover']}
                    overlay={
                      <Menu>
                        <Menu.Item>应用设置</Menu.Item>
                        <Menu.Item>访问应用</Menu.Item>
                        <Menu.Item>复制应用</Menu.Item>
                        <Menu.Item>
                          <span className="text-red-500">删除应用</span>
                        </Menu.Item>
                      </Menu>
                    }
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <div className="mt-6 flex justify-center">
          <Pagination
            total={100}
            pageSize={12}
            hideOnSinglePage
            pageSizeOptions={[8, 12, 16, 24, 36]}
          />
        </div>
      </div>
    </div>
  )
}

export default AppCenterPage
