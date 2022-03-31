import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Dropdown, Space, Tooltip } from 'antd'
import { SaveOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import {
  BaseLayoutProps,
  ComponentRenderNode,
  DragData,
  NodeComponentProps,
} from '../type'
import { useEditorContext } from '../provider'
import { useClassName } from '@/hooks'
import { createNewNode, getComponentNode } from './node-components'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '../constants'
import { DragArea, Draggable } from './dragging'

export interface NodeContainerProps extends NodeComponentProps {
  index: number
  immerParentNode: ComponentRenderNode<BaseLayoutProps> | null
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
      `w-full absolute left-0 h-50px transform flex`,
      {
        '-translate-y-full items-end top-0': placement === 'top',
        'bottom-0 translate-y-full': placement === 'bottom',
        'opacity-0': !isHovering,
      },
    ],
    [placement, isHovering]
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
      <div className="bg-blue-500 h-5px w-full" />
    </DragArea>
  )
}

const NodeContainer: React.FC<NodeContainerProps> = ({
  node,
  disabled: disabledProp,
  immerNode,
  parentNodes,
  immerParentNode,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    { actionNode, hoveringNode, isDragging, moveNode, immerMoveParentNode },
    { setEditorState, updateComponentNode },
  ] = useEditorContext()
  const isHovering = useMemo(() => hoveringNode === node, [hoveringNode, node])
  const renderParentNodes = useMemo(
    () => parentNodes.reverse().slice(0, 5).reverse(),
    [parentNodes]
  )
  const disabled = useMemo(
    () => disabledProp || node === moveNode,
    [disabledProp, moveNode, node]
  )
  const isActionNode = useMemo(() => actionNode === node, [actionNode, node])
  const classes = useClassName(
    [
      'relative border-2 border -m-2px',
      {
        'border-transparent': !isHovering && !isActionNode,
        'border-blue-400 border-dashed': isHovering && !isActionNode,
        'border-blue-500': isActionNode,
      },
    ],
    [isHovering, isActionNode]
  )

  const onNodeWrapperBarDrop: NodeWrapperBarProps['onDrop'] = useCallback(
    ({ placement, ...dragData }) => {
      if (immerParentNode) {
        void updateComponentNode(() => {
          if (dragData.type === 'add') {
            const newNode = createNewNode(dragData.name)
            immerParentNode.props.children.splice(
              placement === 'top' ? index : index + 1,
              0,
              newNode
            )
            setEditorState({
              actionNode: newNode,
            })
          } else if (
            dragData.type === 'move' &&
            immerMoveParentNode &&
            moveNode
          ) {
            if (immerMoveParentNode === immerParentNode) {
              const children: (ComponentRenderNode | null)[] =
                immerParentNode.props.children
              children[dragData.index] = null
              children.splice(
                placement === 'top' ? index : index + 1,
                0,
                moveNode
              )
              immerParentNode.props.children = children.filter(
                (n) => n !== null
              ) as ComponentRenderNode[]
            } else {
              immerMoveParentNode.props.children.splice(dragData.index, 1)
              immerParentNode.props.children.splice(
                placement === 'top' ? index : index + 1,
                0,
                moveNode
              )
            }

            setEditorState({
              immerMoveParentNode: null,
              moveNode: null,
              actionNode: moveNode,
            })
          }
        })
      }
    },
    [
      moveNode,
      immerMoveParentNode,
      immerParentNode,
      index,
      setEditorState,
      updateComponentNode,
    ]
  )

  return (
    <div
      className={classes}
      onMouseOver={(e) => {
        e.stopPropagation()
        setEditorState({
          hoveringNode: node,
        })
      }}
      onMouseOut={(e) => {
        e.stopPropagation()
        setEditorState({
          hoveringNode: null,
        })
      }}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setEditorState({
          actionNode: node,
        })
      }}
    >
      {!disabled && immerParentNode && isDragging && (
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
                {renderParentNodes.map((parentNode) => {
                  return (
                    <NodePathItem
                      className="bg-gray-500 hover:bg-gray-400 text-white"
                      node={parentNode}
                      key={parentNode.id}
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

          <div className="bg-blue-500 px-1 ml-1 rounded-sm">
            <Tooltip title={<span className="text-xs">保存为区块</span>}>
              <SaveOutlined />
            </Tooltip>
            <Tooltip title={<span className="text-xs">复制</span>}>
              <CopyOutlined className="mx-1" />
            </Tooltip>
            <Tooltip title={<span className="text-xs">删除</span>}>
              <DeleteOutlined />
            </Tooltip>
          </div>
        </div>
      )}
      <Draggable
        draggable={!!immerParentNode}
        onDragStart={(_, e) => {
          const div = document.createElement('div')
          div.innerHTML = node.title || node.name
          div.className = 'draggable'
          document.body.appendChild(div)
          e.dataTransfer.setDragImage(div, 10, 10)
          e.stopPropagation()
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData(
            DraggingData.ComponentNode,
            JSON.stringify({
              type: 'move',
              index,
            })
          )
          setEditorState({
            hoveringNode: null,
            actionNode: null,
            isDragging: true,
            moveNode: node,
            immerMoveParentNode: immerParentNode,
          })
        }}
        onDragEnd={(_, e) => {
          e.stopPropagation()
          setEditorState({
            isDragging: false,
            moveNode: null,
            immerMoveParentNode: null,
          })
        }}
      >
        {React.createElement(getComponentNode(node.name).component, {
          node,
          disabled,
          parentNodes: parentNodes,
          immerNode,
        })}
      </Draggable>
    </div>
  )
}

export default NodeContainer
