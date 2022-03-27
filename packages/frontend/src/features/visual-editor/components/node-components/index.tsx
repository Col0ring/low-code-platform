import React from 'react'
import { FileTextOutlined, ContainerOutlined } from '@ant-design/icons'
import { ComponentNode, ComponentsGroup } from '../../type'
import Text from './basic/text'
import Container from './layout/container'
import LayoutContainer from './layout/layout-container'

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
