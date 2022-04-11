import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Breadcrumb, Form, FormInstance, Space, Tabs } from 'antd'
import { useEditorContext } from '../../provider'
import { getComponentNode } from '../node-components'
import { ParentComponentRenderNode } from '../../type'
import StyleTab from './style-tab'
import isEqual from 'lodash/isEqual'
import usePrevious from '@/hooks/usePrevious'

const EditorOperatorArea: React.FC = () => {
  const [
    { actionNode, componentNodesMap, snapshotIndex },
    { setActionNode, updateComponentNode },
  ] = useEditorContext()
  const [active, setActive] = useState('0')
  const renderParentNodes = useMemo(
    () =>
      actionNode ? componentNodesMap[actionNode.id].parentNodes.slice(-2) : [],
    [actionNode, componentNodesMap]
  )
  const renderActionNode = useMemo(
    () => (actionNode ? getComponentNode(actionNode.name) : null),
    [actionNode]
  )
  const operatorTabs = useMemo(() => {
    if (renderActionNode && renderActionNode.component.PropsForm) {
      return [
        {
          title: '属性',
          content: React.createElement(renderActionNode.component.PropsForm, {
            node: actionNode as ParentComponentRenderNode,
          }),
        },
        {
          title: '样式',
          content: <StyleTab node={actionNode as ParentComponentRenderNode} />,
        },
        // {
        //   title: '高级',
        //   content: actionNode ? '高级' : null,
        // },
      ]
    }
    return [
      {
        title: '样式',
        content: actionNode ? (
          <StyleTab node={actionNode as ParentComponentRenderNode} />
        ) : null,
      },
      // {
      //   title: '高级',
      //   content: actionNode ? '高级' : null,
      // },
    ]
  }, [actionNode, renderActionNode])
  const [form] = Form.useForm()
  const formRef = useRef<FormInstance<any>>(null)
  const formValues = useMemo(
    () =>
      actionNode
        ? {
            style: actionNode.style,
            props: actionNode.props,
            children: actionNode.children,
            actions: actionNode.actions,
          }
        : null,
    [actionNode]
  )

  const [prevFormValues, setPrevFormValues] = useState(() => formValues)
  const prevActionNode = usePrevious(actionNode)

  // 如果改变了 snapshotIndex，自动更新 prevActionNode
  useEffect(() => {
    if (!formRef.current) {
      return
    }
    setPrevFormValues(formValues)
    form.resetFields()
    form.setFieldsValue(formValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotIndex])

  // 如果改变了 actionNode 节点，自动更新 prevActionNode
  useEffect(() => {
    if (!formRef.current) {
      return
    }
    if (actionNode?.id !== prevActionNode?.id) {
      setPrevFormValues(formValues)
      form.resetFields()
      form.setFieldsValue(formValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionNode])

  return (
    <div
      className="editor-operator-area"
      onMouseLeave={() => {
        if (
          actionNode &&
          formValues &&
          prevFormValues &&
          !isEqual(formValues, prevFormValues)
        ) {
          updateComponentNode({
            type: 'update',
            node: actionNode,
            ...formValues,
          })
        }
      }}
    >
      {actionNode ? (
        <Form
          ref={formRef}
          form={form}
          size="small"
          onValuesChange={(_changedValues, allValues) => {
            updateComponentNode({
              addSnapshot: false,
              type: 'update',
              node: actionNode,
              ...allValues,
            })
          }}
        >
          <Tabs
            activeKey={active}
            onChange={setActive}
            size="small"
            centered
            moreIcon={null}
          >
            {operatorTabs.map(({ title }, index) => (
              <Tabs.TabPane tab={title} key={index} />
            ))}
          </Tabs>
          <div className="operator-breadcrumb">
            <Breadcrumb separator=">">
              {renderParentNodes.map((parentNode) => (
                <Breadcrumb.Item
                  className="cursor-pointer text-dark-400"
                  key={parentNode.id}
                  onClick={() => {
                    setActionNode(parentNode)
                  }}
                >
                  <Space size="small">
                    {getComponentNode(parentNode.name).icon}
                    {parentNode.title || parentNode.name}
                  </Space>
                </Breadcrumb.Item>
              ))}
              <Breadcrumb.Item key={actionNode.id} className="text-gray-400">
                <Space size="small">
                  {getComponentNode(actionNode.name).icon}
                  {actionNode.title || actionNode.name}
                </Space>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="operator-content">
            {operatorTabs.map(({ content }, index) => (
              <div
                className={active === `${index}` ? '' : 'hidden'}
                key={index}
              >
                {content}
              </div>
            ))}
          </div>
          {/* <div className="absolute left-0 bottom-0 h-12 border border-t-gray-200 w-full p-2 flex justify-end">
         <Button
           type="primary"
           onClick={() => {
             void message.success('应用成功')
           }}
         >
           应用
         </Button>
         <Button
           className="ml-3"
           onClick={() => {
             void message.success('取消操作')
           }}
         >
           取消
         </Button>
       </div> */}
        </Form>
      ) : (
        <div className="text-gray-400 text-center pt-14">
          请在左侧画布选中节点
        </div>
      )}
    </div>
  )
}

export default EditorOperatorArea
