import React from 'react'
import VisualEditor, { VisualEditorActions } from '@/features/visual-editor'
import './style.less'
import { useOutletContext } from 'react-router'
import { Page } from '@/features/app/type'
import { useUpdatePageMutation } from '@/features/app/app.service'
import { safeJsonParser } from '@/utils'
import { ComponentRenderNode } from '@/features/visual-editor/type'
import { useMount } from '@/hooks'

const DesignIndexPage: React.FC = () => {
  const actions = React.useRef<VisualEditorActions>(null)
  const page = useOutletContext<Page>()
  useMount(() => {
    if (actions.current) {
      const data = safeJsonParser<ComponentRenderNode[]>(page.content, [])
      actions.current.init(data.length === 0 ? undefined : data)
    }
  })
  return (
    <div className="design-index-page">
      <VisualEditor className="h-full" actions={actions} />
    </div>
  )
}

export default DesignIndexPage
