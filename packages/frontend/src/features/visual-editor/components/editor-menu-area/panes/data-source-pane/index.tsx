import React, { useState, useMemo } from 'react'
import { Button, Collapse, Dropdown, Input, Menu, Select, Space } from 'antd'
import VariableFormButton from './variable-form-button'
import PanelItemHeader from './panel-item-header'
import { useEditorContext } from '@/features/visual-editor/provider'
import { RemoteDataSource, VarDataSource } from '@/features/visual-editor/type'
import RemoteFormButton from './remote-form-button'
import { isBindVariable, isWrapperValue } from '../../../variable-binding'

const DataSourcePane: React.FC = () => {
  const [{ page }] = useEditorContext()
  const [search, setSearch] = useState('')
  const [select, setSelect] = useState('all')
  const { varDataSources, remoteDataSources } = useMemo(() => {
    const vars: VarDataSource[] = []
    const remotes: RemoteDataSource[] = []
    Object.keys(page.dataSources).forEach((key) => {
      if (page.dataSources[key].type === 'var') {
        vars.push(page.dataSources[key] as VarDataSource)
      } else if (page.dataSources[key].type === 'remote') {
        remotes.push(page.dataSources[key] as RemoteDataSource)
      }
    })
    return { varDataSources: vars, remoteDataSources: remotes }
  }, [page.dataSources])

  const dataSources = useMemo(() => {
    return [
      {
        type: 'params' as const,
        name: 'urlParams',
        desc: '当前页面地址的 query 参数',
      },
      ...varDataSources,
      ...remoteDataSources,
    ]
  }, [varDataSources, remoteDataSources])
  const searchDataSources = useMemo(() => {
    return dataSources.filter(
      (item) =>
        (select === 'all' || item.type === select) && item.name.includes(search)
    )
  }, [dataSources, search, select])

  return (
    <div className="data-source-pane">
      <div className="flex">
        <Select onSelect={setSelect} value={select}>
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="var">变量</Select.Option>
          <Select.Option value="remote">远程</Select.Option>
        </Select>
        <Input.Search className="ml-1" allowClear onSearch={setSearch} />
      </div>

      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="var">
              <VariableFormButton type="add" />
            </Menu.Item>
            <Menu.Item key="remote">
              <RemoteFormButton type="add" />
            </Menu.Item>
          </Menu>
        }
      >
        <Button className="my-2" type="primary">
          添加
        </Button>
      </Dropdown>
      <div className="overflow-auto flex-1 w-full break-all">
        <Collapse className="w-full">
          {searchDataSources.map((item) => {
            if (item.type === 'params') {
              return (
                <Collapse.Panel
                  header={
                    <PanelItemHeader
                      type="params"
                      name={item.name}
                      hideAction
                    />
                  }
                  key={item.name}
                >
                  <div className="text-xs">
                    <Space className="mt-2">
                      <span className="text-gray-500">描述</span>
                      {item.desc}
                    </Space>
                  </div>
                </Collapse.Panel>
              )
            } else if (item.type === 'var') {
              return (
                <Collapse.Panel
                  header={<PanelItemHeader type="var" name={item.name} />}
                  key={item.name}
                >
                  <div className="text-xs">
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">描述</span>
                        {item.desc}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">默认值</span>
                        {item.defaultValue}
                      </Space>
                    </div>
                  </div>
                </Collapse.Panel>
              )
            } else if (item.type === 'remote') {
              return (
                <Collapse.Panel
                  header={<PanelItemHeader type="remote" name={item.name} />}
                  key={item.name}
                >
                  <div className="text-xs">
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">描述</span>
                        {item.desc}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">请求路径</span>
                        {isBindVariable(item.fetch.url)
                          ? '绑定变量'
                          : isWrapperValue(item.fetch.url)
                          ? item.fetch.url.value
                          : item.fetch.url}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">请求方法</span>
                        {isBindVariable(item.fetch.method)
                          ? '绑定变量'
                          : isWrapperValue(item.fetch.method)
                          ? item.fetch.method.value
                          : item.fetch.method}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">请求参数</span>
                        {isBindVariable(item.fetch.data)
                          ? '绑定变量'
                          : isWrapperValue(item.fetch.data)
                          ? item.fetch.data.value
                          : item.fetch.data}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">自动加载</span>
                        {item.autoLoad ? '是' : '否'}
                      </Space>
                    </div>
                    <div className="mt-2">
                      <Space>
                        <span className="text-gray-500">默认值</span>
                        {item.defaultValue}
                      </Space>
                    </div>
                  </div>
                </Collapse.Panel>
              )
            }
          })}
        </Collapse>
      </div>
    </div>
  )
}

export default DataSourcePane
