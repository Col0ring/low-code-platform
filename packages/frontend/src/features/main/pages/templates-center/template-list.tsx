import { Col, Empty, Input, Pagination, Row, Spin } from 'antd'
import React, { useState } from 'react'
import { useGetTemplateListQuery } from '../../main.service'
import TemplateItem from './template-item'

const TemplateList: React.FC = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(12)
  const { data: { data, count } = { data: [], count: 0 }, isFetching } =
    useGetTemplateListQuery({
      page,
      pageSize,
      search,
    })
  return (
    <Spin spinning={isFetching}>
      <div className="px-4 py-3">
        <div className="py-2">
          <Input.Search
            onSearch={setSearch}
            placeholder="请输入模板名称"
            className="w-320px"
            allowClear
          />
        </div>
        {count === 0 ? (
          <Empty className="mt-200px" description="没有搜索到模板" />
        ) : (
          <div>
            <Row gutter={[15, 15]} className="mt-4">
              {data.map((template) => (
                <Col key={template.id} span={6}>
                  <TemplateItem template={template} />
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
  )
}

export default TemplateList
