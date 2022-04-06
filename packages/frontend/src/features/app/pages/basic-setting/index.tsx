import React from 'react'
import { Form, Input } from 'antd'
import { emptyValidator } from '@/utils/validators'

const BasicSettingPage = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="bg-white p-4 rounded-md m-4">
        <h2 className="font-bold text-lg">基础设置</h2>
        <div className="w-3/5 mt-5">
          <Form layout="vertical">
            <Form.Item
              name="name"
              label="应用名称"
              rules={[emptyValidator('应用名称')]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="icon" label="应用图标">
              <Input />
            </Form.Item>
            <Form.Item name="desc" label="应用描述">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default BasicSettingPage
