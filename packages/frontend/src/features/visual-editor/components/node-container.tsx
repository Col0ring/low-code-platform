import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Dropdown, Space, Tooltip } from 'antd'
import { SaveOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { ComponentRenderNode, DragData, NodeComponentProps } from '../type'
import { useEditorContext } from '../provider'
import { useClassName } from '@/hooks'
import { createNewNode, getComponentNode } from './node-components'
import { safeJsonParser } from '@/utils'
import { DraggingData } from '../constants'
import { DragArea } from './dragging'

export interface NodeContainerProps extends NodeComponentProps {
  index: number
  immerParentNode: NodeComponentProps['parentNodes'][number] | null
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
      `${placement}-0  w-full absolute left-0 h-30px transform flex`,
      {
        '-translate-y-full items-end': placement === 'top',
        'translate-y-full': placement === 'bottom',
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
            name: '',
          }
        )
        componentNode.name &&
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
  immerNode,
  parentNodes,
  immerParentNode,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const [{ actionNode }, { setEditorState, updateComponentNode }] =
    useEditorContext()
  const renderParentNodes = useMemo(
    () => parentNodes.reverse().slice(0, 5).reverse(),
    [parentNodes]
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
    ({ name, placement }) => {
      if (immerParentNode) {
        void updateComponentNode(() => {
          const newNode = createNewNode(name)
          immerParentNode.props.children.splice(
            placement === 'top' ? index : index + 1,
            0,
            newNode
          )
          setEditorState({
            actionNode: newNode,
          })
        })
      }
    },
    [immerParentNode, index, setEditorState, updateComponentNode]
  )

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      className={classes}
      onMouseOver={(e) => {
        e.stopPropagation()
        setIsHovering(true)
      }}
      onMouseOut={(e) => {
        e.stopPropagation()
        setIsHovering(false)
      }}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setEditorState({
          actionNode: node,
        })
      }}
    >
      {immerParentNode && (
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
      {React.createElement(getComponentNode(node.name).component, {
        node,
        parentNodes: parentNodes,
        immerNode,
      })}
    </div>
  )
}

export default NodeContainer
