import React from 'react'
import { FileTextOutlined, ContainerOutlined } from '@ant-design/icons'
import { ComponentNode, ComponentsGroup } from '../../type'
import Text from './basic/text'
import Container from './layout/container'
import LayoutContainer from './layout/layout-container'
import Layout from './layout/layout'

export const componentsLibrary: ComponentsGroup[] = [
  {
    group: '布局',
    components: [
      {
        name: 'container',
        title: '容器',
        component: Container,
        icon: <ContainerOutlined />,
      },
      {
        // 不会显示在 menu 菜单中
        name: 'layout',
        hideInMenu: true,
        component: Layout,
        icon: <ContainerOutlined />,
      },
      {
        name: 'layout-container',
        title: '布局容器',
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

export function getComponentNode(name: string) {
  return componentsMap[name] || null
}
