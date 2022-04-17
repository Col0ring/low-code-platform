import React from 'react'
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd'
import { Actions } from '../../type'
import { noop } from '@/utils'
import ActionModal from '../action-modal'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export interface AddActionProps {
  menus: { event: string; title: string }[]
  value?: Actions
  onChange?: (value: Actions) => void
}

const AddAction: React.FC<AddActionProps> = ({
  menus,
  value = {},
  onChange = noop,
}) => {
  return (
    <>
      {menus.map((menu) => {
        const { title, event } = menu
        const events = value[event]
        return events && events.length > 0 ? (
          <div key={event} className="p-2">
            <div className="bg-gray-200 p-2 text-xs">{title}</div>
            <div className="mt-2 p-1">
              {events.map((e, index) => {
                const { actionEvent } = e
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                  >
                    {actionEvent}
                    <Space>
                      <Tooltip title="编辑">
                        <ActionModal
                          action={e}
                          modalProps={{ title: actionEvent }}
                          onOk={(values) => {
                            onChange({
                              ...value,
                              [menu.event]: [
                                ...value[menu.event].slice(0, index),
                                values,
                                ...value[menu.event].slice(index + 1),
                              ],
                            })
                          }}
                        >
                          <EditOutlined className="cursor-pointer" />
                        </ActionModal>
                      </Tooltip>
                      <Tooltip title="删除">
                        <DeleteOutlined
                          onClick={() => {
                            onChange({
                              ...value,
                              [event]: events.filter((_, i) => i !== index),
                            })
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null
      })}
      <Dropdown
        placement="bottom"
        overlay={
          <Menu>
            {menus.map((menu) => {
              return (
                <Menu.Item key={menu.event}>
                  <ActionModal
                    modalProps={{ title: menu.title }}
                    onOk={(values) => {
                      if (value[menu.event]) {
                        onChange({
                          ...value,
                          [menu.event]: [...value[menu.event], values],
                        })
                      } else {
                        onChange({
                          ...value,
                          [menu.event]: [values],
                        })
                      }
                    }}
                  >
                    {menu.title}
                  </ActionModal>
                </Menu.Item>
              )
            })}
          </Menu>
        }
      >
        <Button className="mt-3" type="primary" size="middle" block>
          新建动作
        </Button>
      </Dropdown>
    </>
  )
}

export default AddAction
