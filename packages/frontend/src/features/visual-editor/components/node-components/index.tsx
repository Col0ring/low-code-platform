import React from 'react'
import { FileTextOutlined, ContainerOutlined } from '@ant-design/icons'
import {
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

export const componentsLibrary: ComponentsGroup[] = [
  {
    group: '布局',
    components: [
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
        name: 'layout-container2',
        title: '布局容器2',
        component: LayoutContainer,
        icon: <ContainerOutlined />,
      },
    ],
  },
  {
    group: '基础',
    components: [
      {
        name: 'text',
        title: '文本',
        component: Text,
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
      style: {},
      id: component.getId(),
      props: component.getInitialProps(),
      children: component.getInitialChildren(),
    }
  }
  return {
    title,
    name,
    style: {},
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
      props: node.props,
      children: node.children.map((child) => copyNode(child)),
    }
  }
  return {
    title: node.title,
    name: node.name,
    style: node.style,
    id: component.getId(),
    props: component.getInitialProps(),
  }
}
