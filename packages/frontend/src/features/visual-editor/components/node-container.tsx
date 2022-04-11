import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Dropdown, Space, Tooltip } from 'antd'
import { SaveOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import {
  ComponentRenderNode,
  DragData,
  NodeComponentProps,
  ParentComponentRenderNode,
} from '../type'
import { useEditorContext } from '../provider'
import { useClassName } from '@/hooks'
import { copyNode, createNewNode, getComponentNode } from './node-components'
import { safeJsonParser, stopPropagation } from '@/utils'
import { DraggingData } from '../constants'
import { DragArea, Draggable } from './dragging'
import { StrictOmit } from 'types-kit'

export interface NodeContainerProps
  extends StrictOmit<NodeComponentProps, 'node'> {
  index: number
  node: ComponentRenderNode
}

interface NodePathItemProps {
  className?: string
  node: ComponentRenderNode
}

const NodePathItem: React.FC<NodePathItemProps> = ({ node, className }) => {
  const classes = useClassName(
    [className, 'cursor-pointer rounded-sm px-1'],
    [className]
  )
  const [, { setEditorState }] = useEditorContext()
  const componentNode = useMemo(() => getComponentNode(node.name), [node.name])
  return (
    <div
      className={classes}
      onClick={(e) => {
        e.stopPropagation()
        setEditorState({ actionNode: node })
      }}
    >
      <Space size="small">
        {componentNode.icon}
        {componentNode.title || componentNode.name}
      </Space>
    </div>
  )
}
interface NodeWrapperBarProps {
  placement: 'top' | 'bottom'
  onDrop: (
    data: DragData & { placement: 'top' | 'bottom' },
    e: React.DragEvent
  ) => void
}
const NodeWrapperBar: React.FC<NodeWrapperBarProps> = ({
  placement,
  onDrop,
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const classes = useClassName(
    [
      `w-full absolute left-0 h-20px flex z-1 items-center`,
      {
        '-top-5px': placement === 'top',
        '-bottom-5px': placement === 'bottom',
        'opacity-0': !isHovering,
      },
    ],
    [placement, isHovering]
  )
  const barClasses = useClassName(
    [
      'bg-blue-500 h-5px w-full',
      {
        'transform -translate-y-full': placement === 'top',
        'transform translate-y-full': placement === 'bottom',
      },
    ],
    [placement]
  )
  return (
    <DragArea
      className={classes}
      onChange={setIsHovering}
      onDrop={(e) => {
        e.dataTransfer.dropEffect = 'move'
        const componentNode = safeJsonParser<DragData>(
          e.dataTransfer.getData(DraggingData.ComponentNode),
          {
            type: '',
          } as unknown as DragData
        )
        componentNode.type &&
          onDrop(
            {
              ...componentNode,
              placement,
            },
            e
          )
        e.stopPropagation()
      }}
    >
      <div className={barClasses} />
    </DragArea>
  )
}

const NodeContainer: React.FC<NodeContainerProps> = ({
  node,
  disabled: disabledProp,
  parentNodes,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    { actionNode, hoveringNode, isDragging, moveNode, moveParentNode },
    {
      updateComponentNode,
      startDragging,
      finishDragging,
      setEditorState,
      setActionNode,
    },
  ] = useEditorContext()

  const isHovering = useMemo(() => hoveringNode === node, [hoveringNode, node])
  const renderParentNodes = useMemo(
    () => parentNodes.reverse().slice(0, 5).reverse(),
    [parentNodes]
  )

  const isParentNodeAction = useMemo(
    () =>
      parentNodes.includes(actionNode as ParentComponentRenderNode) ||
      parentNodes.includes(moveNode as ParentComponentRenderNode),
    [actionNode, moveNode, parentNodes]
  )
  const parentNode = useMemo(
    () => parentNodes[parentNodes.length - 1],
    [parentNodes]
  )
  const hasAction = useMemo(
    () =>
      parentNode &&
      !getComponentNode(parentNode.name).component.childActionDisabled,
    [parentNode]
  )
  const disabled = useMemo(
    () => disabledProp || node === moveNode,
    [disabledProp, moveNode, node]
  )
  const isActionNode = useMemo(() => actionNode === node, [actionNode, node])
  const classes = useClassName(
    [
      'relative border-2 border -m-2px',
      // ['inline-block', 'inline', 'inline-flex'].includes(
      //   node.style.display as string
      // )
      //   ? 'inline-block'
      //   : 'block',
      {
        'border-transparent': !isHovering && !isActionNode,
        'border-blue-400 border-dashed': isHovering && !isActionNode,
        'border-blue-500': isActionNode,
        'z-1': moveNode === node,
      },
    ],
    [isHovering, isActionNode, moveNode, node]
  )

  const dragImage = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'draggable'
    return div
  }, [])

  const onNodeWrapperBarDrop: NodeWrapperBarProps['onDrop'] = useCallback(
    ({ placement, ...dragData }) => {
      if (parentNode) {
        if (dragData.type === 'add') {
          const newNode = createNewNode(dragData.name)
          finishDragging({ actionNode: newNode })
          updateComponentNode({
            type: 'add',
            parentNode,
            index: placement === 'top' ? index : index + 1,
            newNode,
          })
        } else if (dragData.type === 'move' && moveNode && moveParentNode) {
          finishDragging({ actionNode: moveNode })
          updateComponentNode({
            type: 'move',
            moveNode,
            moveParentNode,
            moveNodeIndex: dragData.index,
            parentNode,
            nodeIndex: placement === 'top' ? index : index + 1,
          })
        }
      }
    },
    [
      parentNode,
      moveNode,
      moveParentNode,
      finishDragging,
      updateComponentNode,
      index,
    ]
  )
  return (
    <div
      style={{
        display:
          node.style.display === 'inline' ? 'inline-block' : node.style.display,
      }}
      className={classes}
      onMouseOver={(e) => {
        e.stopPropagation()
        if (!isDragging) {
          setEditorState({
            hoveringNode: node,
          })
        }
      }}
      onMouseOut={(e) => {
        e.stopPropagation()
        if (!isDragging) {
          setEditorState({
            hoveringNode: null,
          })
        }
      }}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setActionNode(node)
      }}
    >
      {!disabled && hasAction && isDragging && (
        <>
          <NodeWrapperBar placement="top" onDrop={onNodeWrapperBarDrop} />
          <NodeWrapperBar placement="bottom" onDrop={onNodeWrapperBarDrop} />
        </>
      )}

      {isHovering && !isActionNode && (
        <div className="absolute top-0 left-0 width-auto transform -translate-y-full text-blue-400 text-xs pb-1">
          {node.title || node.name}
        </div>
      )}

      {isActionNode && (
        <div className="absolute right-0 top-0 transform -translate-y-full flex text-white pb-1 whitespace-nowrap">
          <Dropdown
            trigger={['hover', 'click']}
            overlay={
              <div>
                {renderParentNodes.map((renderParentNode) => {
                  return (
                    <NodePathItem
                      className="bg-gray-500 hover:bg-gray-400 text-white"
                      node={renderParentNode}
                      key={renderParentNode.id}
                    />
                  )
                })}
              </div>
            }
          >
            <div>
              <NodePathItem className="bg-blue-500" node={node} />
            </div>
          </Dropdown>

          {hasAction && (
            <div
              className="bg-blue-500 px-1 ml-1 rounded-sm"
              onClick={stopPropagation}
            >
              <Tooltip title={<span className="text-xs">保存为区块</span>}>
                <SaveOutlined />
              </Tooltip>
              <Tooltip title={<span className="text-xs">复制</span>}>
                <CopyOutlined
                  className="mx-1"
                  onClick={() => {
                    const newNode = copyNode(node)
                    updateComponentNode({
                      type: 'add',
                      newNode,
                      parentNode,
                      index: index + 1,
                    })
                  }}
                />
              </Tooltip>
              <Tooltip title={<span className="text-xs">删除</span>}>
                <DeleteOutlined
                  onClick={() => {
                    setActionNode(null)
                    updateComponentNode({
                      type: 'delete',
                      node,
                      parentNode,
                      index,
                    })
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      )}
      <Draggable
        className="absolute left-0 top-0 w-full h-full z-1"
        draggable={hasAction && !isParentNodeAction}
        onDragStart={(_, e) => {
          e.dataTransfer.effectAllowed = 'move'
          dragImage.innerHTML = node.title || node.name
          document
            .getElementById('editor-drag-image-container')
            ?.appendChild(dragImage)
          e.dataTransfer.setDragImage(dragImage, 10, 10)
          e.stopPropagation()
          e.dataTransfer.setData(
            DraggingData.ComponentNode,
            JSON.stringify({
              type: 'move',
              index,
            })
          )
          startDragging({
            moveNode: node,
            moveParentNode: parentNode,
          })
        }}
        onDragEnd={(_, e) => {
          document
            .getElementById('editor-drag-image-container')
            ?.removeChild(dragImage)
          e.stopPropagation()
          // mouseover 延迟问题
          requestAnimationFrame(() => {
            finishDragging()
          })
        }}
      />
      {React.createElement(getComponentNode(node.name).component, {
        node: node as ParentComponentRenderNode,
        disabled,
        parentNodes: parentNodes,
        editType: 'edit',
      })}
    </div>
  )
}

export default NodeContainer
