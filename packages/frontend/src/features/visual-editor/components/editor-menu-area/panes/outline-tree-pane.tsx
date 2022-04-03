import React, { useMemo } from 'react'
import { Tree } from 'antd'
import { useEditorContext } from '../../../provider'
import { DataNode as OriginDataNode } from 'antd/lib/tree'
import {
  ComponentRenderNode,
  ParentComponentRenderNode,
} from '@/features/visual-editor/type'
import { getComponentNode } from '../../node-components'
import { DraggingData } from '@/features/visual-editor/constants'

interface DataNode extends OriginDataNode {
  name: string
  node: ComponentRenderNode
  parentNode: ParentComponentRenderNode | null
  nodeIndex: number
  draggable: boolean
}

function generateData(
  componentNodes: ComponentRenderNode[],
  parentNode: ParentComponentRenderNode | null,
  draggable: boolean
): DataNode[] {
  return componentNodes.map((node, index) => {
    const { title, name, children, id } = node
    const isLeaf = !Array.isArray(children)
    return {
      nodeIndex: index,
      name,
      node,
      draggable,
      parentNode,
      title,
      key: id,
      isLeaf,
      children: isLeaf
        ? undefined
        : generateData(
            children,
            node as ParentComponentRenderNode,
            getComponentNode(name).component.childActionDisabled ? false : true
          ),
    }
  })
}

const OutlineTreePane: React.FC = () => {
  const [
    { componentNodes, menuSelectedKeys },
    { setEditorState, startDragging, finishDragging, updateComponentNode },
  ] = useEditorContext()
  const treeData = useMemo(
    () => generateData(componentNodes, null, false),
    [componentNodes]
  )
  const dragImage = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'draggable'
    return div
  }, [])
  return (
    <div className="outline-tree-pane">
      <Tree
        className="draggable-tree"
        allowDrop={({ dropNode, dropPosition }) => {
          console.log(dropNode)

          const { draggable, name } = dropNode as unknown as DataNode
          // dropPosition === 0  代表放入 dropNode 内部 1 代表相同等级，-1 最顶层的第一个
          return ((dropNode.isLeaf ||
            getComponentNode(name).component.childActionDisabled) &&
            dropPosition === 0) ||
            (!draggable && dropPosition === 1)
            ? false
            : true
        }}
        draggable={{
          icon: false,
          nodeDraggable: (node) => {
            const { draggable } = node as unknown as DataNode
            return draggable
          },
        }}
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
        onDragStart={({ event: e, node }) => {
          e.dataTransfer.effectAllowed = 'move'
          const {
            node: moveNode,
            parentNode,
            nodeIndex,
          } = node as unknown as DataNode
          if (!parentNode) {
            return
          }
          dragImage.innerHTML = moveNode.title || moveNode.name
          document
            .getElementById('editor-drag-image-container')
            ?.appendChild(dragImage)
          e.dataTransfer.setDragImage(dragImage, 10, 10)
          e.stopPropagation()
          e.dataTransfer.setData(
            DraggingData.ComponentNode,
            JSON.stringify({
              type: 'move',
              index: nodeIndex,
            })
          )
          startDragging({ moveNode, moveParentNode: parentNode })
        }}
        onDragEnd={({ event: e }) => {
          document
            .getElementById('editor-drag-image-container')
            ?.removeChild(dragImage)
          e.stopPropagation()
          // mouseover 延迟问题
          requestAnimationFrame(() => {
            finishDragging()
          })
        }}
        onDrop={({ dragNode, node, dropPosition, event: e }) => {
          e.dataTransfer.effectAllowed = 'move'
          const dropPos = node.pos.split('-')
          const position = dropPosition - Number(dropPos[dropPos.length - 1])
          const {
            node: dropNode,
            parentNode: dropParentNode,
            nodeIndex: dropNodeIndex,
          } = node as unknown as DataNode
          const {
            node: moveNode,
            parentNode: moveParentNode,
            nodeIndex: moveNodeIndex,
          } = dragNode as unknown as DataNode
          if (!moveParentNode || !dropParentNode) {
            return
          }
          finishDragging({ actionNode: moveNode })
          if (position === 0) {
            updateComponentNode({
              type: 'move',
              moveNode,
              moveParentNode,
              moveNodeIndex,
              parentNode: dropNode as ParentComponentRenderNode,
              nodeIndex: 0,
            })
          } else if (position === 1) {
            updateComponentNode({
              type: 'move',
              moveNode,
              moveParentNode,
              moveNodeIndex,
              parentNode: dropParentNode,
              nodeIndex: dropNodeIndex,
            })
          }
        }}
        treeData={treeData}
      />
    </div>
  )
}

export default OutlineTreePane
