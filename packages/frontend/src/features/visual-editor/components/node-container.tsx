import React, { useRef, useMemo } from 'react'
import { Dropdown, Space } from 'antd'
import {
  DownloadOutlined,
  UploadOutlined,
  FileAddOutlined,
  MinusSquareOutlined,
  ClearOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import useHover from '../hooks/useHover'
import { ComponentRenderNode } from '../type'
import { useEditorContext } from '../provider'
import { useClassName } from '@/hooks'
import { getComponentNode } from './node-components'

export interface NodeContainerProps {
  node: ComponentRenderNode
  immerNode: ComponentRenderNode
  parentNodes: ComponentRenderNode[]
}

interface NodePathItemProps {
  className?: string
  node: ComponentRenderNode
}

const NodePathItem: React.FC<NodePathItemProps> = ({ node, className }) => {
  const classes = useClassName(
    [className, 'cursor-pointer rounded-sm px-1 '],
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

const NodeContainer: React.FC<NodeContainerProps> = ({
  node,
  immerNode,
  parentNodes,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isHovering = useHover(ref)
  const [{ actionNode }, { setEditorState }] = useEditorContext()
  const renderParentNodes = useMemo(
    () => parentNodes.reverse().slice(0, 5),
    [parentNodes]
  )
  const isActionNode = useMemo(() => actionNode === node, [actionNode, node])
  const classes = useClassName(
    [
      'relative border-1 border',
      {
        'border-transparent': !isHovering && !isActionNode,
        'border-blue-400 border-dotted': isHovering && !isActionNode,
        'border-blue-500': isActionNode,
      },
    ],
    [isHovering, isActionNode]
  )

  return (
    <div
      className={classes}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        setEditorState({
          actionNode: node,
        })
      }}
    >
      {isActionNode && (
        <div className="absolute right-0 top-0 transform -translate-y-full flex text-white pb-1">
          <Dropdown
            trigger={['hover']}
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
            <MinusSquareOutlined />
            <MinusSquareOutlined className="mx-1" />
            <MinusSquareOutlined />
          </div>
        </div>
      )}
      {React.createElement(getComponentNode(node.name).component, {
        key: node.id,
        node,
        parentNodes: [...parentNodes, node],
        immerNode,
      })}
    </div>
  )
}

export default NodeContainer
