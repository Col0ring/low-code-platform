import React, { useMemo } from 'react'
import { Tooltip, Tree } from 'antd'
import { useEditorContext } from '../../../provider'
import { DataNode as OriginDataNode } from 'antd/lib/tree'
import {
  ComponentRenderNode,
  ParentComponentRenderNode,
} from '@/features/visual-editor/type'
import { getComponentNode } from '../../node-components'
import { DraggingData } from '@/features/visual-editor/constants'
import Screen, { ScreenProps } from '../../node-components/layout/screen'
import SvgIcon from '@/components/svg-icon'
import ConditionSvg from '../../../assets/condition.svg?raw'
import CycleSvg from '../../../assets/cycle.svg?raw'
import { isBindVariable } from '../../variable-binding'
import { safeJsonParser } from '@/utils'
import { DeleteOutlined } from '@ant-design/icons'
interface DataNode extends OriginDataNode {
  name: string
  node: ComponentRenderNode
  parentNode: ParentComponentRenderNode | null
  nodeIndex: number
  draggable: boolean
}

function generateData(
  {
    componentNodes,
    parentNode,
    draggable,
    disabled,
  }: {
    componentNodes: ComponentRenderNode[]
    parentNode: ParentComponentRenderNode | null
    draggable: boolean
    disabled?: boolean
  },
  currentScreen?: ComponentRenderNode | null
): DataNode[] {
  return componentNodes.map((node, index) => {
    const { title, name, children, id } = node
    const isLeaf = !Array.isArray(children)
    return {
      nodeIndex: index,
      name,
      node,
      disabled:
        typeof disabled === 'undefined'
          ? !!(currentScreen && currentScreen.id !== id)
          : disabled,
      draggable,
      parentNode,
      title:
        node.name === Screen.nodeName
          ? (node as ComponentRenderNode<ScreenProps>).props.title
          : title,
      key: id,
      isLeaf,
      children: isLeaf
        ? undefined
        : generateData({
            componentNodes: children,
            parentNode: node as ParentComponentRenderNode,
            draggable: getComponentNode(name).component.childActionDisabled
              ? false
              : true,
            disabled:
              typeof disabled === 'undefined'
                ? !!(currentScreen && currentScreen.id !== id)
                : disabled,
          }),
    }
  })
}

const OutlineTreePane: React.FC = () => {
  const [
    { page, menuSelectedKeys, currentScreen },
    { setActionNode, startDragging, finishDragging, updateComponentNode },
  ] = useEditorContext()
  const treeData = useMemo(
    () =>
      generateData(
        {
          componentNodes: page.children,
          draggable: false,
          parentNode: null,
        },
        currentScreen
      ),
    [page.children, currentScreen]
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
        titleRender={(treeNode) => {
          return (
            <div className="flex items-center justify-between w-full">
              <span className="inline-flex items-center">
                <span>{getComponentNode(treeNode.name).icon}</span>
                <span className="ml-1">{treeNode.title || treeNode.name}</span>
                {(isBindVariable(treeNode.node.advanced.condition.isRender) ||
                  !treeNode.node.advanced.condition.isRender.value) && (
                  <Tooltip title="条件">
                    <SvgIcon className="text-red-600 ml-1" raw={ConditionSvg} />
                  </Tooltip>
                )}
                {(isBindVariable(treeNode.node.advanced.cycle?.data) ||
                  safeJsonParser(
                    treeNode.node.advanced.cycle?.data?.value || '[]',
                    []
                  ).length !== 0) && (
                  <Tooltip title="循环">
                    <SvgIcon className="text-green-600 ml-1" raw={CycleSvg} />
                  </Tooltip>
                )}
              </span>
              {treeNode.draggable && (
                <span
                  className="text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateComponentNode({
                      type: 'delete',
                      node: treeNode.node,
                      parentNode:
                        treeNode.parentNode as ParentComponentRenderNode,
                      index: treeNode.nodeIndex,
                    })
                  }}
                >
                  <DeleteOutlined />
                </span>
              )}
            </div>
          )
        }}
        allowDrop={({ dropNode, dropPosition }) => {
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
        onSelect={(_, { node }) => {
          if (!menuSelectedKeys.includes(node.key)) {
            setActionNode((node as unknown as DataNode).node)
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
          if (!moveParentNode) {
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
            if (!dropParentNode) {
              return
            }
            updateComponentNode({
              type: 'move',
              moveNode,
              moveParentNode,
              moveNodeIndex,
              parentNode: dropParentNode,
              // 在当前节点的下面一个
              nodeIndex: dropNodeIndex + 1,
            })
          }
        }}
        treeData={treeData}
      />
    </div>
  )
}

export default OutlineTreePane
