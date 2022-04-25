import React, { useState } from 'react'
import VisualEditor, { VisualEditorActions } from '@/features/visual-editor'
import './style.less'
import { useOutletContext } from 'react-router'
import { Page } from '@/features/app/type'
import { useUpdatePageMutation } from '@/features/app/app.service'
import { isResolved, safeJsonParser } from '@/utils'
import { PageRenderNode } from '@/features/visual-editor/type'
import { useMount } from '@/hooks'
import { App } from '@/features/main/type'
import { message } from 'antd'
import {
  useCreateBlockMutation,
  useDeleteBlockMutation,
  useGetBlockListQuery,
  useUpdateBlockMutation,
} from '../../design.service'
const DesignIndexPage: React.FC = () => {
  const actions = React.useRef<VisualEditorActions>(null)

  const page = useOutletContext<
    Page & {
      app: App
    }
  >()
  const [blockSearch, setBlockSearch] = useState('')
  const [reqCreateBlock] = useCreateBlockMutation()
  const [reqUpdateBlock] = useUpdateBlockMutation()
  const [reqDeleteBlock] = useDeleteBlockMutation()
  const [reqUpdatePage] = useUpdatePageMutation()
  const { data } = useGetBlockListQuery(blockSearch)
  useMount(() => {
    if (actions.current) {
      const initialData = safeJsonParser<PageRenderNode | null>(
        page.content,
        null
      )
      actions.current.init(initialData || undefined)
    }
  })
  return (
    <div className="design-index-page">
      <VisualEditor
        className="h-full"
        actions={actions}
        blocks={data?.data || []}
        onBlockSearch={setBlockSearch}
        onBlockAdd={async (block) => {
          const res = await reqCreateBlock(block)
          if (isResolved(res)) {
            void message.success(`区块 ${block.name} 创建成功`)
          }
        }}
        onSave={async (content) => {
          const res = await reqUpdatePage({
            appId: page.app.id,
            pageId: page.id,
            data: {
              content: JSON.stringify(content),
            },
          })
          if (isResolved(res)) {
            void message.success('保存成功')
          }
        }}
        onBlockDelete={async ({ blockId }, block) => {
          const res = await reqDeleteBlock(blockId)
          if (isResolved(res)) {
            void message.success(`区块 ${block.name} 删除成功`)
          }
        }}
        onBlockUpdate={async ({ blockId, name }) => {
          const res = await reqUpdateBlock({ blockId, name })
          if (isResolved(res)) {
            void message.success(`区块 ${name} 修改成功`)
          }
        }}
      />
    </div>
  )
}

export default DesignIndexPage
