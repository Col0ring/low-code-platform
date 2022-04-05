import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Tooltip, Divider, Button, Radio, message, Form, Input } from 'antd'
import redoSvg from '../../assets/redo.svg?raw'
import undoSvg from '../../assets/undo.svg?raw'
import {
  DownloadOutlined,
  UploadOutlined,
  FileAddOutlined,
  MinusSquareOutlined,
  ClearOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import SvgIcon from '@/components/svg-icon'
import { useMount, useResize } from '@/hooks'
import { elementCanScroll } from '@/utils'
import { useEditorContext } from '../../provider'
import { copyNode, createNewNode } from '../node-components'
import Screen, { ScreenProps } from '../node-components/layout/screen'
import { ComponentRenderNode } from '../../type'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import { MonacoEditor, MonacoEditorProps } from '@/components/monaco-editor'
const SimulatorToolbar: React.FC = () => {
  const [canScroll, setCanScroll] = useState(false)
  const [screen, setScreen] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const [
    { currentScreen, snapshotIndex, snapshots, componentNodes },
    { updateScreen, setActionNode, changeSnapShot, updateComponentNode },
  ] = useEditorContext()

  const [addScreenForm] = Form.useForm()
  const monacoEditorRef: MonacoEditorProps['editor'] = useRef(null)

  const tools = useMemo(
    () => [
      [
        {
          element: (
            <ModalButton
              modalTitle="请输入屏幕名称"
              modal={
                <Form form={addScreenForm} preserve={false}>
                  <Form.Item name="title" rules={[emptyValidator('屏幕名称')]}>
                    <Input />
                  </Form.Item>
                </Form>
              }
              onModalOK={async () => {
                const { title } = await addScreenForm.validateFields()
                const newScreen = createNewNode(Screen.nodeName)
                ;(newScreen as ComponentRenderNode<ScreenProps>).props.title =
                  title
                updateScreen({
                  type: 'add',
                  screen: newScreen,
                })
              }}
              size="small"
              icon={<FileAddOutlined />}
            />
          ),
          title: '新增屏幕',
        },
        {
          element: (
            <Button
              onClick={() => {
                if (currentScreen) {
                  updateScreen({
                    type: 'add',
                    screen: copyNode(currentScreen),
                  })
                }
              }}
              size="small"
              icon={<CopyOutlined />}
            />
          ),
          title: '复制屏幕',
        },
        {
          element: (
            <Button
              onClick={() => {
                if (currentScreen) {
                  updateScreen({
                    type: 'clear',
                    screen: currentScreen,
                  })
                }
              }}
              size="small"
              icon={<ClearOutlined />}
            />
          ),
          title: '清空屏幕',
        },
        {
          element: (
            <Button
              onClick={() => {
                if (componentNodes.length === 1) {
                  void message.error('至少保留一个屏幕')
                  return
                }
                if (currentScreen) {
                  updateScreen({
                    type: 'delete',
                    screen: currentScreen,
                  })
                }
              }}
              size="small"
              icon={<MinusSquareOutlined />}
            />
          ),
          title: '删除屏幕',
        },
      ],
      [
        {
          element: (
            <Button
              size="small"
              disabled={snapshotIndex <= 0}
              onClick={() => {
                changeSnapShot(snapshotIndex - 1)
              }}
              icon={<SvgIcon raw={undoSvg} />}
            />
          ),
          title: '撤销 command + z',
        },
        {
          element: (
            <Button
              disabled={snapshotIndex >= snapshots.length - 1}
              onClick={() => {
                changeSnapShot(snapshotIndex + 1)
              }}
              size="small"
              icon={<SvgIcon raw={redoSvg} />}
            />
          ),
          title: '重做 command + shift + z',
        },
      ],
      [
        {
          element: (
            <ModalButton
              modalTitle="导入页面"
              modal={
                <div className="h-300px">
                  <MonacoEditor
                    editor={monacoEditorRef}
                    scrollBeyondLastLine={false}
                    language="json"
                    minimap={{ enabled: false }}
                  />
                </div>
              }
              onModalOK={() => {
                if (monacoEditorRef.current) {
                  try {
                    const value = monacoEditorRef.current.getValue()
                    if (!value) {
                      return Promise.reject()
                    }
                    const nodes = JSON.parse(value)
                    updateScreen({
                      type: 'change',
                      screen: nodes[0],
                    })
                    setActionNode(null)
                    updateComponentNode({
                      type: 'init',
                      componentNodes: nodes,
                    })
                  } catch (error) {
                    void message.error('导入失败，请检查格式是否正确')
                  }
                }
              }}
              size="small"
              icon={<UploadOutlined />}
            />
          ),
          title: '导入页面',
        },
        {
          element: (
            <ModalButton
              modalTitle="导出页面"
              showCancelButton={false}
              modal={
                <div className="h-300px">
                  <MonacoEditor
                    scrollBeyondLastLine={false}
                    readOnly
                    value={JSON.stringify(componentNodes, null, 2)}
                    language="json"
                    minimap={{ enabled: false }}
                  />
                </div>
              }
              size="small"
              icon={<DownloadOutlined />}
            />
          ),
          title: '导出页面',
        },
      ],
    ],
    [
      addScreenForm,
      changeSnapShot,
      componentNodes,
      currentScreen,
      setActionNode,
      snapshotIndex,
      snapshots.length,
      updateComponentNode,
      updateScreen,
    ]
  )

  useResize(ref, (el) => {
    setCanScroll(elementCanScroll(el))
  })

  useMount(() => {
    if (ref.current) {
      const el = ref.current
      setCanScroll(elementCanScroll(el))
    }
  })

  useEffect(() => {
    setScreen(currentScreen?.id || '')
  }, [currentScreen?.id])

  return (
    <div className="simulator-toolbar-container">
      <div className="simulator-toolbar" ref={ref}>
        <div className="flex items-center">
          {tools.map((group, index) => {
            return (
              <React.Fragment key={index}>
                {group.map(({ title, element }, i) => {
                  return (
                    <Tooltip title={title} key={i} placement="bottom">
                      {element}
                    </Tooltip>
                  )
                })}
                {index !== tools.length - 1 && (
                  <Divider type="vertical" className="h-7" />
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="flex items-center">
          {canScroll && <Divider type="vertical" className="h-7" />}
          <Radio.Group value={screen} size="small">
            {componentNodes.map(
              (screenNode: ComponentRenderNode<ScreenProps>, i) => (
                <Radio.Button
                  key={screenNode.id}
                  value={screenNode.id}
                  onClick={() =>
                    updateScreen({
                      type: 'change',
                      screen: screenNode,
                    })
                  }
                >
                  {screenNode.props.title}
                </Radio.Button>
              )
            )}
          </Radio.Group>
          <Divider type="vertical" className="h-7" />
          <Button size="small">预览</Button>
          <Button size="small" type="primary">
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SimulatorToolbar
