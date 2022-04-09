import React, { useState, useImperativeHandle, useMemo } from 'react'
import EditorMenuArea from './components/editor-menu-area'
import EditorOperatorArea from './components/editor-operator-area'
import EditorSimulatorArea from './components/editor-simulator-area'
import './style.less'
import { useEditorContext, withEditorProvider } from './provider'
import { ComponentRenderNode } from './type'
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
  init: (data?: ComponentRenderNode[]) => void
}
export interface VisualEditorProps {
  className?: string
  onChange?: (data: ComponentRenderNode[]) => void
  onSave?: EditorPropsContextState['onSave']
  onPreview?: (data: ComponentRenderNode[]) => void
  actions: React.RefObject<VisualEditorActions>
}
const VisualEditor: React.FC<VisualEditorProps> = (props) => {
  const { className, onChange, onSave = noop, actions } = props
  const classes = useClassName([className, 'visual-editor-container'], [])
  const [{ componentNodes }, { updateComponentNode, setCurrentScreen }] =
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
        const initialComponentNodes = data || [newScreen]
        setCurrentScreen(initialComponentNodes[0])
        updateComponentNode({
          type: 'init',
          componentNodes: initialComponentNodes,
        })
        setIsInit(true)
      },
    }),
    [isInit, setCurrentScreen, updateComponentNode]
  )

  const memoEditorValue = useMemo(() => ({ onSave }), [onSave])

  useUpdateEffect(() => {
    onChange?.(componentNodes)
  }, [componentNodes])

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
