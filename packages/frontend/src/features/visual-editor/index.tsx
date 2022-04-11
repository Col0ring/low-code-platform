import React, { useState, useImperativeHandle, useMemo } from 'react'
import EditorMenuArea from './components/editor-menu-area'
import EditorOperatorArea from './components/editor-operator-area'
import EditorSimulatorArea from './components/editor-simulator-area'
import './style.less'
import { useEditorContext, withEditorProvider } from './provider'
import { ComponentRenderNode, PageRenderNode } from './type'
import { createNewNode } from './components/node-components'
import Screen, { ScreenProps } from './components/node-components/layout/screen'
import { useClassName, useUpdateEffect } from '@/hooks'
import { Spin } from 'antd'
import {
  EditorPropsContext,
  EditorPropsContextState,
} from './editor-props-context'
import { noop } from '@/utils'

export interface VisualEditorActions {
  init: (data?: PageRenderNode) => void
}
export interface VisualEditorProps {
  className?: string
  onChange?: (data: PageRenderNode) => void
  onSave?: EditorPropsContextState['onSave']
  onPreview?: (data: PageRenderNode) => void
  actions: React.RefObject<VisualEditorActions>
}
const VisualEditor: React.FC<VisualEditorProps> = (props) => {
  const { className, onChange, onSave = noop, actions } = props
  const classes = useClassName([className, 'visual-editor-container'], [])
  const [{ page }, { updateComponentNode, setCurrentScreen }] =
    useEditorContext()
  const [isInit, setIsInit] = useState(false)
  useImperativeHandle(
    actions,
    () => ({
      init(data) {
        if (isInit) {
          return
        }
        const newScreen = createNewNode(
          Screen.nodeName
        ) as ComponentRenderNode<ScreenProps>
        newScreen.props.title = '屏幕1'
        const newPage: PageRenderNode = {
          ...createNewNode(page.name),
          js: '',
          children: [newScreen],
          modals: [],
        }
        setCurrentScreen(data?.children[0] || newScreen)
        updateComponentNode({
          type: 'init',
          page: data || newPage,
        })
        setIsInit(true)
      },
    }),
    [isInit, page.name, setCurrentScreen, updateComponentNode]
  )

  const memoEditorValue = useMemo(() => ({ onSave }), [onSave])

  useUpdateEffect(() => {
    onChange?.(page)
  }, [page])

  return (
    <EditorPropsContext.Provider value={memoEditorValue}>
      <Spin wrapperClassName={classes} spinning={!isInit}>
        <div
          className="visual-editor"
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
          }}
        >
          <EditorMenuArea />
          <EditorSimulatorArea />
          <EditorOperatorArea />
        </div>
      </Spin>
      <div
        className="fixed top-0 left-0 -z-1"
        id="editor-drag-image-container"
      />
    </EditorPropsContext.Provider>
  )
}

export default withEditorProvider(VisualEditor)
