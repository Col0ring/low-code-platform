import React from 'react'
import { Button, Dropdown, Menu, Tooltip } from 'antd'
import { Actions } from '../../type'
import { noop } from '@/utils'
import ActionModal from '../action-modal'
import { DeleteOutlined } from '@ant-design/icons'

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
      {menus.map(({ title, event }) => {
        const events = value[event]
        return events && events.length > 0 ? (
          <div key={event} className="p-2">
            <div className="bg-gray-200 p-2 text-xs">{title}</div>
            <div className="mt-2 p-1 bg-gray-50 hover:bg-gray-100">
              {events.map(({ actionEvent }, index) => (
                <div key={index} className="flex justify-between items-center">
                  {actionEvent}
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
                </div>
              ))}
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
