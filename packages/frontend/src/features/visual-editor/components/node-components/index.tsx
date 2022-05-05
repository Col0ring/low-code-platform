import React, { useMemo } from 'react'
import {
  Actions,
  BindingValue,
  ComponentNode,
  ComponentRenderNode,
  ComponentsGroup,
  NodeComponent,
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
import { compileNormalValue, getBindingValue } from '../../utils'
import { isBindVariable } from '../variable-binding'
import Video from './basic/video'
import Input from './form/input'
import Card from './layout/card'
import Loading from './feedback/loading'

function getComponentConfig(Component: NodeComponent<any>) {
  return {
    name: Component.nodeName,
    title: Component.title,
    icon: Component.icon,
    component: Component,
  }
}

export const componentsLibrary: ComponentsGroup[] = [
  {
    group: '布局',
    components: [
      {
        ...getComponentConfig(Page),
        hideInMenu: true,
      },
      {
        ...getComponentConfig(Screen),
        hideInMenu: true,
      },
      {
        ...getComponentConfig(Container),
      },
      {
        ...getComponentConfig(Layout),
        hideInMenu: true,
      },
      {
        ...getComponentConfig(LayoutContainer),
      },
      {
        ...getComponentConfig(Card),
      },
      {
        ...getComponentConfig(Tabs),
      },
    ],
  },
  {
    group: '基础',
    components: [
      {
        ...getComponentConfig(Text),
      },
      {
        ...getComponentConfig(Button),
      },
      {
        ...getComponentConfig(Image),
      },
      {
        ...getComponentConfig(Link),
      },
      {
        ...getComponentConfig(Video),
      },
    ],
  },
  {
    group: '表单',
    components: [
      {
        ...getComponentConfig(Input),
      },
    ],
  },
  {
    group: '反馈',
    components: [
      {
        ...getComponentConfig(Alert),
      },
      {
        ...getComponentConfig(Loading),
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

export function createBindingValue<T>(value: T): BindingValue<T> {
  return {
    __BINDING__: true,
    type: 'normal',
    value,
  }
}

export function createNewNode(name: string): ComponentRenderNode {
  const { component, title } = getComponentNode(name)
  if (component.getInitialChildren) {
    return {
      title,
      name,
      advanced: {
        condition: {
          isRender: createBindingValue(true),
        },
      },
      style: component.getInitialStyle?.() || {},
      id: component.getId(),
      props: component.getInitialProps(),
      children: component.getInitialChildren(),
    }
  }
  return {
    title,
    name,
    advanced: {
      condition: {
        isRender: createBindingValue(true),
      },
    },
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
      advanced: node.advanced,
      id: component.getId(),
      props: safeJsonParser(JSON.stringify(node.props), node.props),
      children: node.children.map((child) => copyNode(child)),
    }
  }
  return {
    title: node.title,
    name: node.name,
    style: node.style,
    advanced: node.advanced,
    id: component.getId(),
    props: safeJsonParser(JSON.stringify(node.props), node.props),
  }
}

interface RenderComponentProps {
  node: ComponentRenderNode
  editType: 'prod' | 'edit'
  disabled?: boolean
  parentNodes?: ParentComponentRenderNode[]
}

export function transformNode(
  dataSources: Record<string, any>,
  node: ComponentRenderNode,
  cycleData?: {
    item: {
      name: string
      value: any
    }
    index: {
      name: string
      value: any
    }
  }
) {
  const transform = (v: Record<string, any>) => {
    return Object.keys(v).reduce((acc, key) => {
      acc[key] = getBindingValue(dataSources, v[key], cycleData)
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
  disabled,
  parentNodes,
}) => {
  const { dataSources } = useEditorPreviewContext()
  const canRender = useMemo(
    () => getBindingValue(dataSources, node.advanced.condition.isRender),
    [dataSources, node.advanced.condition.isRender]
  )
  const cycleData = useMemo(() => {
    if (!node.advanced.cycle) {
      return {
        item: 'item',
        index: 'index',
        data: [],
      }
    }
    const item = getBindingValue(
      dataSources,
      node.advanced.cycle.item || 'item'
    )
    const index = getBindingValue(
      dataSources,
      node.advanced.cycle.index || 'index'
    )

    let data: any[] = []
    if (node.advanced.cycle?.data) {
      if (isBindVariable(node.advanced.cycle.data)) {
        data = getBindingValue(dataSources, node.advanced.cycle.data)
      } else {
        data = compileNormalValue(node.advanced.cycle.data?.value)
      }
    }
    return {
      item,
      index,
      data,
    }
  }, [dataSources, node.advanced.cycle])

  if (!canRender && editType === 'prod') {
    return null
  }
  if (!cycleData.data) {
    return null
  }
  if (cycleData.data.length !== 0) {
    return (
      <>
        {cycleData.data.map((item, index) => {
          const transformedNode = transformNode(dataSources, node, {
            item: {
              name: cycleData.item,
              value: item,
            },
            index: {
              name: cycleData.index,
              value: index,
            },
          }) as ParentComponentRenderNode
          const key = getBindingValue(
            dataSources,
            node.advanced.cycle?.key || index,
            {
              item: {
                name: cycleData.item,
                value: item,
              },
              index: {
                name: cycleData.index,
                value: index,
              },
            }
          )
          return React.createElement(getComponentNode(node.name).component, {
            node: transformedNode,
            parentNodes: parentNodes || [],
            disabled,
            key: node.id + `_${key}`,
            editType,
          })
        })}
      </>
    )
  }
  return (
    <>
      {React.createElement(getComponentNode(node.name).component, {
        node: transformNode(dataSources, node, {
          item: {
            name: cycleData.item,
            value: undefined,
          },
          index: {
            name: cycleData.index,
            value: undefined,
          },
        }) as ParentComponentRenderNode,
        parentNodes: parentNodes || [],
        disabled,
        key: node.id,
        editType,
      })}
    </>
  )
}

export function renderNode(
  node: ComponentRenderNode,
  editType: 'prod' | 'edit' = 'prod',
  {
    disabled,
    parentNodes,
  }: {
    parentNodes?: ParentComponentRenderNode[]
    disabled?: boolean
  } = {}
) {
  return (
    <RenderComponent
      disabled={disabled}
      key={node.id}
      node={node}
      parentNodes={parentNodes}
      editType={editType}
    />
  )
}

export function renderNodes(
  nodes: ComponentRenderNode[],
  editType: 'prod' | 'edit' = 'prod',
  {
    disabled,
    parentNodes,
  }: {
    parentNodes?: ParentComponentRenderNode[]
    disabled?: boolean
  } = {}
) {
  return nodes.map((node) =>
    renderNode(node, editType, { disabled, parentNodes })
  )
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

export function advancedItemName(type: string, name: string) {
  return ['advanced', type, name]
}
