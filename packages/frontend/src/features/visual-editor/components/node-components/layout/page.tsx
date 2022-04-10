import React, { useEffect, useState } from 'react'
import {
  ComponentRenderNode,
  NodeComponent,
} from '@/features/visual-editor/type'
import { ScreenProps } from './screen'
import { renderNode } from '..'
import { getId } from '@/utils'
import { useEditorContext } from '@/features/visual-editor/provider'
import NodeContainer from '../../node-container'

const Page: NodeComponent = ({ node, editType }) => {
  const { children } = node
  const [screen, setScreen] = useState(() =>
    children.find(
      (child: ComponentRenderNode<ScreenProps>) =>
        child.props.minWidth <= window.innerWidth &&
        (child.props.maxWidth === 'max' ||
          child.props.maxWidth >= window.innerWidth)
    )
  )
  const [{ currentScreen }] = useEditorContext(false) || [{}, {}]
  useEffect(() => {
    function onResize() {
      setScreen(
        children.find(
          (child: ComponentRenderNode<ScreenProps>) =>
            child.props.minWidth <= window.innerWidth &&
            (child.props.maxWidth === 'max' ||
              child.props.maxWidth >= window.innerWidth)
        )
      )
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [children])

  if (editType === 'prod') {
    return renderNode(screen || children[0])
  }

  return (
    <>
      {children.map((child, index) => {
        return currentScreen?.id === child.id ? (
          <NodeContainer
            index={index}
            parentNodes={[node]}
            key={child.id}
            node={child}
          />
        ) : null
      })}
    </>
  )
}

Page.getInitialStyle = () => ({})
Page.getInitialProps = () => ({})
Page.getInitialChildren = () => []
Page.getId = () => getId('page')
Page.nodeName = 'page'
Page.title = '页面'

export default Page
