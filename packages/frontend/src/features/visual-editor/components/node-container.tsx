import React, { useRef, useMemo } from 'react'
import { Dropdown } from 'antd'
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
  const classes = useClassName([className], [className])
  const [, { setEditorState }] = useEditorContext()
  return (
    <div
      className="cursor-pointer"
      onClick={() => setEditorState({ actionNode: node })}
    >
      123
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
  const [, { setEditorState }] = useEditorContext()
  const renderParentNodes = useMemo(
    () => parentNodes.reverse().slice(0, 5),
    [parentNodes]
  )
  const classes = useClassName(
    [
      {
        'border border-blue-500': isHovering,
      },
    ],
    [isHovering]
  )

  return (
    <div
      className={'relative border border-blue-500 border-2'}
      ref={ref}
      onClick={() =>
        setEditorState({
          actionNode: node,
        })
      }
    >
      <div className="absolute right-0 top-0 transform -translate-y-full flex text-white pb-1">
        <div className="bg-blue-500 px-1 rounded-sm">
          <Dropdown
            trigger={['hover']}
            overlay={
              <div>
                {renderParentNodes.map((parentNode) => {
                  return <NodePathItem node={parentNode} key={parentNode.id} />
                })}
              </div>
            }
          >
            <div>
              <NodePathItem node={node} />
            </div>
          </Dropdown>
        </div>
        <div className="bg-blue-500 px-1 ml-1 rounded-sm">
          <MinusSquareOutlined />
          <MinusSquareOutlined className="mx-1" />
          <MinusSquareOutlined />
        </div>
      </div>
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
