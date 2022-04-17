import React, { useState } from 'react'
import {
  Button,
  Collapse,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Space,
  Tooltip,
} from 'antd'
import ModalButton from '@/components/modal-button'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const DataSourcePane: React.FC = () => {
  const [select, setSelect] = useState('all')
  return (
    <div className="data-source-pane">
      <div className="flex">
        <Select onSelect={setSelect} value={select}>
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="var">变量</Select.Option>
          <Select.Option value="remote">远程</Select.Option>
        </Select>
        <Input.Search className="ml-1" allowClear />
      </div>

      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="var">
              <ModalButton
                modalTitle="新增变量"
                type="text"
                modal={
                  <Form layout="vertical" preserve={false}>
                    <Form.Item label="名称" name="name">
                      <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="desc">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={
                        <p>
                          <p>数据</p>
                          <p className="text-gray-400 text-xs">
                            请输入 JS 标准数据
                          </p>
                        </p>
                      }
                      name="value"
                    >
                      <Input.TextArea />
                    </Form.Item>
                  </Form>
                }
                renderButton={(props) => <div {...props}>变量</div>}
              />
            </Menu.Item>
            <Menu.Item key="remote">远程 API</Menu.Item>
          </Menu>
        }
      >
        <Button className="my-2" type="primary">
          添加
        </Button>
      </Dropdown>
      <Collapse>
        <Collapse.Panel
          header={
            <Space className="font-bold">
              <span className="text-orange-400">参数</span>urlParams
            </Space>
          }
          key="urlParams"
        >
          <div className="text-xs">
            <Space className="mt-2">
              <span className="text-gray-500">描述</span>
              当前页面地址的参数
            </Space>
          </div>
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <div className="flex justify-between w-full">
              <Space className="font-bold">
                <span className="text-green-400">参数</span>dp1
              </Space>
              <Space>
                <Tooltip title="编辑">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <DeleteOutlined
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  />
                </Tooltip>
              </Space>
            </div>
          }
          key="vars"
        >
          <div className="text-xs">
            <Space className="mt-2">
              <span className="text-gray-500">变量</span>
              当前页面地址的参数
            </Space>
          </div>
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Space className="font-bold">
              <span className="text-blue-400">远程</span>dp2
            </Space>
          }
          key="remote"
        >
          <div className="text-xs">
            <Space className="mt-2">
              <span className="text-gray-500">描述</span>
              当前页面地址的参数
            </Space>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default DataSourcePane
