import React from 'react'
import { Tabs } from 'antd'
import { ComponentRenderNode } from '../../type'
import { ScreenProps } from '../node-components/layout/screen'
import { renderNode } from '../node-components'

export interface EditorPreviewProps {
  screens: ComponentRenderNode<ScreenProps>[]
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ screens }) => {
  return (
    <Tabs>
      {screens.map((screen) => {
        return (
          <Tabs.TabPane key={screen.id} tab={screen.props.title}>
            {renderNode(screen)}
          </Tabs.TabPane>
        )
      })}
    </Tabs>
  )
}

export default EditorPreview
