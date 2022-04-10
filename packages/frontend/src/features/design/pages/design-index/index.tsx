import React from 'react'
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

const DesignIndexPage: React.FC = () => {
  const actions = React.useRef<VisualEditorActions>(null)
  const page = useOutletContext<
    Page & {
      app: App
    }
  >()
  const [reqUpdatePage] = useUpdatePageMutation()
  useMount(() => {
    if (actions.current) {
      const data = safeJsonParser<PageRenderNode | null>(page.content, null)
      actions.current.init(data || undefined)
    }
  })
  return (
    <div className="design-index-page">
      <VisualEditor
        className="h-full"
        actions={actions}
        onSave={async (data) => {
          const res = await reqUpdatePage({
            appId: page.app.id,
            pageId: page.id,
            data: {
              content: JSON.stringify(data),
            },
          })
          if (isResolved(res)) {
            void message.success('保存成功')
          }
        }}
      />
    </div>
  )
}

export default DesignIndexPage
