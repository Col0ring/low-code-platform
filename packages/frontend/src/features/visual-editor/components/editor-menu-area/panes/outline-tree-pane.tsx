import React, { useMemo } from 'react'
import { Tree } from 'antd'
import { useEditorContext } from '../../../provider'
import { DataNode as OriginDataNode } from 'antd/lib/tree'
import {
  ComponentRenderNode,
  BaseLayoutProps,
} from '@/features/visual-editor/type'
import { getComponentNode } from '../../node-components'
import { DraggingData } from '@/features/visual-editor/constants'

interface DataNode extends OriginDataNode {
  name: string
  node: ComponentRenderNode
  immerNode: ComponentRenderNode
  immerParentNode: ComponentRenderNode<BaseLayoutProps> | null
  nodeIndex: number
}

function generateData(
  componentNodes: ComponentRenderNode<BaseLayoutProps>[],
  immerComponentNodes: ComponentRenderNode<BaseLayoutProps>[],
  immerParentNode: ComponentRenderNode<BaseLayoutProps> | null
): DataNode[] {
  return componentNodes.map((node, index) => {
    const { title, name, props, id } = node
    const isLeaf = !Array.isArray(props.children)
    return {
      nodeIndex: index,
      name,
      node,
      immerParentNode,
      immerNode: immerComponentNodes[index],
      title,
      key: id,
      isLeaf,
      children: isLeaf
        ? undefined
        : generateData(
            props.children,
            immerComponentNodes[index].props.children,
            getComponentNode(name).component.disabledChildAction
              ? null
              : immerComponentNodes[index]
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
    () => generateData(componentNodes, immerComponentNodes, null),
    [componentNodes, immerComponentNodes]
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

          const { immerParentNode, name } = dropNode as unknown as DataNode
          // dropPosition === 0  代表放入 dropNode 内部 1 代表相同等级，-1 最顶层的第一个
          return ((dropNode.isLeaf ||
            getComponentNode(name).component.disabledChildAction) &&
            dropPosition === 0) ||
            (!immerParentNode && dropPosition === 1)
            ? false
            : true
        }}
        draggable={{
          icon: false,
          nodeDraggable: (node) => {
            const { immerParentNode } = node as unknown as DataNode
            return !!immerParentNode
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
            immerParentNode,
            nodeIndex,
          } = node as unknown as DataNode
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
          setEditorState({
            hoveringNode: null,
            actionNode: null,
            isDragging: true,
            moveNode,
            immerMoveParentNode: immerParentNode,
          })
        }}
        onDragEnd={({ event: e }) => {
          document
            .getElementById('editor-drag-image-container')
            ?.removeChild(dragImage)
          e.stopPropagation()
          // mouseover 延迟问题
          requestAnimationFrame(() => {
            setEditorState({
              isDragging: false,
              moveNode: null,
              immerMoveParentNode: null,
            })
          })
        }}
        onDrop={({ dragNode, node, dropPosition, event: e }) => {
          e.dataTransfer.effectAllowed = 'move'
          const dropPos = node.pos.split('-')
          const position = dropPosition - Number(dropPos[dropPos.length - 1])
          const {
            immerNode,
            immerParentNode,
            nodeIndex: index,
          } = node as unknown as DataNode
          const {
            node: moveNode,
            immerParentNode: immerMoveParentNode,
            nodeIndex: moveIndex,
          } = dragNode as unknown as DataNode
          if (!immerMoveParentNode) {
            return
          }
          void updateComponentNode(() => {
            // 拖进 node 内部
            if (position === 0) {
              immerMoveParentNode.props.children.splice(moveIndex, 1)
              ;(
                immerNode as ComponentRenderNode<BaseLayoutProps>
              ).props.children.unshift(moveNode)

              // 拖如 node 下方
            } else if (position === 1) {
              if (!immerParentNode) {
                return
              }
              // 同一个父级
              if (immerParentNode === immerMoveParentNode) {
                const children: (ComponentRenderNode | null)[] =
                  immerParentNode.props.children
                children[moveIndex] = null
                children.splice(index + 1, 0, moveNode)
                immerParentNode.props.children = children.filter(
                  (n) => n !== null
                ) as ComponentRenderNode[]
              } else {
                immerMoveParentNode.props.children.splice(moveIndex, 1)
                immerParentNode.props.children.splice(index + 1, 0, moveNode)
              }
            }
            setEditorState({
              immerMoveParentNode: null,
              moveNode: null,
              hoveringNode: null,
              actionNode: moveNode,
            })
          })
        }}
        treeData={treeData}
      />
    </div>
  )
}

export default OutlineTreePane
