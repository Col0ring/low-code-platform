import React, { useMemo } from 'react'
import { FileTextOutlined, ContainerOutlined } from '@ant-design/icons'
import {
  Actions,
  ComponentNode,
  ComponentRenderNode,
  ComponentsGroup,
  ParentComponentRenderNode,
} from '../../type'
import Text from './basic/text'
import Container from './layout/container'
import LayoutContainer from './layout/layout-container'
import Layout from './layout/layout'
import Screen from './layout/screen'
import Page from './layout/page'
import { safeJsonParser } from '@/utils'
import Button from './basic/button'
import {
  EditorPreviewContextValue,
  useEditorPreviewContext,
} from '../editor-preview/provider'
import Image from './basic/image'
import Link from './basic/link'
import Tabs from './layout/tabs'
import Alert from './feedback/alert'
import { getBindingValue } from '../../utils'

export const componentsLibrary: ComponentsGroup[] = [
  {
    group: '布局',
    components: [
      {
        name: Page.nodeName,
        title: Page.title,
        hideInMenu: true,
        component: Page,
        icon: <ContainerOutlined />,
      },
      {
        name: Screen.nodeName,
        title: Screen.title,
        hideInMenu: true,
        component: Screen,
        icon: <ContainerOutlined />,
      },
      {
        name: Container.nodeName,
        title: Container.title,
        component: Container,
        icon: <ContainerOutlined />,
      },
      {
        // 不会显示在 menu 菜单中
        name: Layout.nodeName,
        title: Layout.title,
        hideInMenu: true,
        component: Layout,
        icon: <ContainerOutlined />,
      },
      {
        name: LayoutContainer.nodeName,
        title: LayoutContainer.title,
        component: LayoutContainer,
        icon: <ContainerOutlined />,
      },
      {
        name: Tabs.nodeName,
        title: Tabs.title,
        component: Tabs,
        icon: <ContainerOutlined />,
      },
    ],
  },
  {
    group: '基础',
    components: [
      {
        name: Text.nodeName,
        title: Text.title,
        component: Text,
        icon: <FileTextOutlined />,
      },
      {
        name: Button.nodeName,
        title: Button.title,
        component: Button,
        icon: <FileTextOutlined />,
      },
      {
        name: Image.nodeName,
        title: Image.title,
        component: Image,
        icon: <FileTextOutlined />,
      },
      {
        name: Link.nodeName,
        title: Link.title,
        component: Link,
        icon: <FileTextOutlined />,
      },
    ],
  },
  {
    group: '反馈',
    components: [
      {
        name: Alert.nodeName,
        title: Alert.title,
        component: Alert,
        icon: <FileTextOutlined />,
      },
    ],
  },
]

export const componentsMap = componentsLibrary.reduce(
  (prev, { components }) => {
    components.forEach((component) => {
      prev[component.name] = component
    })
    return prev
  },
  {} as Record<string, ComponentNode>
)

export function isParentComponentRenderNode(
  node: ComponentRenderNode
): node is ParentComponentRenderNode {
  return !!node?.children
}

export function getComponentNode(name: string) {
  return componentsMap[name] || null
}
export function createNewNode(name: string): ComponentRenderNode {
  const { component, title } = getComponentNode(name)
  if (component.getInitialChildren) {
    return {
      title,
      name,
      style: component.getInitialStyle?.() || {},
      id: component.getId(),
      props: component.getInitialProps(),
      children: component.getInitialChildren(),
    }
  }
  return {
    title,
    name,
    style: component.getInitialStyle?.() || {},
    id: component.getId(),
    props: component.getInitialProps(),
  }
}

export function copyNode(node: ComponentRenderNode): ComponentRenderNode {
  const { component } = getComponentNode(node.name)
  if (node.children) {
    return {
      title: node.title,
      name: node.name,
      style: node.style,
      id: component.getId(),
      props: safeJsonParser(JSON.stringify(node.props), node.props),
      children: node.children.map((child) => copyNode(child)),
    }
  }
  return {
    title: node.title,
    name: node.name,
    style: node.style,
    id: component.getId(),
    props: safeJsonParser(JSON.stringify(node.props), node.props),
  }
}

interface RenderComponentProps {
  node: ComponentRenderNode
  editType: 'prod' | 'edit'
}

export function transformNode(
  dataSources: Record<string, any>,
  node: ComponentRenderNode
) {
  const transform = (v: Record<string, any>) => {
    return Object.keys(v).reduce((acc, key) => {
      acc[key] = getBindingValue(dataSources, v[key])
      return acc
    }, {} as Record<string, any>)
  }

  return {
    ...node,
    props: transform(node.props),
    style: transform(node.style),
  }
}

const RenderComponent: React.FC<RenderComponentProps> = ({
  node,
  editType,
}) => {
  const { dataSources } = useEditorPreviewContext()
  const transformedNode = useMemo(
    () => transformNode(dataSources, node),
    [dataSources, node]
  )
  return (
    <>
      {React.createElement(getComponentNode(node.name).component, {
        node: transformedNode as ParentComponentRenderNode,
        parentNodes: [],
        key: node.id,
        editType,
      })}
    </>
  )
}

export function renderNode(
  node: ComponentRenderNode,
  editType: 'prod' | 'edit' = 'prod'
) {
  return <RenderComponent key={node.id} node={node} editType={editType} />
}

export function renderNodes(
  nodes: ComponentRenderNode[],
  editType: 'prod' | 'edit' = 'prod'
) {
  return nodes.map((node) => renderNode(node, editType))
}

export function parserActions(
  actions: Actions,
  contextActionsHandler: EditorPreviewContextValue['actions'],
  editType: 'prod' | 'edit' = 'prod'
) {
  if (editType === 'edit') {
    return {}
  }
  return Object.keys(actions).reduce((prev, next) => {
    prev[next] = (e?: React.UIEvent, v?: any) => {
      actions[next].forEach(({ actionType, actionEvent, value }) => {
        ;(contextActionsHandler[actionType] as Record<string, any>)[
          actionEvent
        ]?.(
          v
            ? {
                actionParams: safeJsonParser(value, value),
                external: v,
              }
            : safeJsonParser(value, value),
          e
        )
      })
    }
    return prev
  }, {} as Record<string, (e?: React.UIEvent, v?: any) => void>)
}

export function propItemName(name: string) {
  return ['props', name]
}

export function styleItemName(name: string) {
  return ['style', name]
}
