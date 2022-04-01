import React, { useMemo, useState } from 'react'
import { Tree } from 'antd'
import { useEditorContext } from '../../../provider'
import { DataNode as OriginDataNode } from 'antd/lib/tree'
import {
  ComponentRenderNode,
  BaseLayoutProps,
} from '@/features/visual-editor/type'
import { getComponentNode } from '../../node-components'

interface DataNode extends OriginDataNode {
  name: string
  node: ComponentRenderNode
  immerNode: ComponentRenderNode
}

function generateData(
  componentNodes: ComponentRenderNode<BaseLayoutProps>[],
  immerComponentNodes: ComponentRenderNode<BaseLayoutProps>[]
): DataNode[] {
  return componentNodes.map((node, index) => {
    const { title, name, props, id } = node
    const isLeaf = !Array.isArray(props.children) || props.children.length === 0
    return {
      name,
      node,
      immerNode: immerComponentNodes[index],
      title,
      key: id,
      isLeaf,
      children: isLeaf
        ? undefined
        : generateData(
            props.children,
            immerComponentNodes[index].props.children
          ),
    }
  })
}

const OutlineTreePane: React.FC = () => {
  const [
    { immerComponentNodes, componentNodes, menuSelectedKeys },
    { setEditorState, updateComponentNode },
  ] = useEditorContext()
  const treeData = useMemo(
    () => generateData(componentNodes, immerComponentNodes),
    [componentNodes, immerComponentNodes]
  )
  return (
    <div className="outline-tree-pane">
      <Tree
        className="draggable-tree"
        draggable={{ icon: false }}
        showLine={{ showLeafIcon: false }}
        blockNode
        showIcon
        selectedKeys={menuSelectedKeys}
        icon={({ name }: DataNode) => getComponentNode(name).icon}
        onSelect={(_, { node }) => {
          if (!menuSelectedKeys.includes(node.key)) {
            setEditorState({
              actionNode: (node as unknown as DataNode).node,
            })
          }
        }}
        defaultExpandAll
        // onDragEnter={this.onDragEnter}
        // onDrop={this.onDrop}
        treeData={treeData}
      />
    </div>
  )
}

export default OutlineTreePane
