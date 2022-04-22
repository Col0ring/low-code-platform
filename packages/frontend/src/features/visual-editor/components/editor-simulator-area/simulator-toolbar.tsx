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
  QuestionCircleOutlined,
} from '@ant-design/icons'
import SvgIcon from '@/components/svg-icon'
import { useEventListener, useMount, useResize } from '@/hooks'
import { elementCanScroll, isMac } from '@/utils'
import { useEditorContext } from '../../provider'
import { copyNode, createNewNode } from '../node-components'
import Screen, { ScreenProps } from '../node-components/layout/screen'
import { ComponentRenderNode, PageRenderNode } from '../../type'
import ModalButton from '@/components/modal-button'
import { emptyValidator } from '@/utils/validators'
import { MonacoEditor, MonacoEditorProps } from '@/components/monaco-editor'
import { useEditorPropsContext } from '../../editor-props-context'
import PageView from '@/features/design/components/page-view'
const SimulatorToolbar: React.FC = () => {
  const [canScroll, setCanScroll] = useState(false)
  const [screen, setScreen] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const [
    { currentScreen, snapshotIndex, snapshots, page },
    {
      updateScreen,
      setActionNode,
      changeSnapShot,
      updateComponentNode,
      setEditorState,
    },
  ] = useEditorContext()
  const screens = useMemo(() => page.children, [page])

  const [addScreenForm] = Form.useForm()
  const monacoEditorRef: MonacoEditorProps['editor'] = useRef(null)

  const { onSave } = useEditorPropsContext()

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
                if (currentScreen) {
                  const { title } = await addScreenForm.validateFields()
                  const newScreen = copyNode(currentScreen)
                  ;(newScreen as ComponentRenderNode<ScreenProps>).props.title =
                    title
                  updateScreen({
                    type: 'add',
                    screen: newScreen,
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
                if (screens.length === 1) {
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
          title: `撤销 ${isMac ? 'command' : 'ctrl'} + z`,
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
          title: `重做 ${isMac ? 'command' : 'ctrl'} + shift + z`,
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
                    const newPage: PageRenderNode = JSON.parse(value)
                    updateScreen({
                      type: 'change',
                      screen: newPage.children[0],
                    })
                    setActionNode(null)
                    updateComponentNode({
                      type: 'init',
                      page: newPage,
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
                    value={JSON.stringify(page, null, 2)}
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
      currentScreen,
      page,
      screens.length,
      setActionNode,
      snapshotIndex,
      snapshots.length,
      updateComponentNode,
      updateScreen,
    ]
  )

  useEventListener(document, 'keyup', () => {
    setEditorState({
      disabledNodeAction: false,
    })
  })

  useEventListener(document, 'keydown', (e) => {
    const metaKey = isMac ? e.metaKey : e.ctrlKey

    if (metaKey) {
      setEditorState({
        disabledNodeAction: true,
      })
    }

    if (metaKey && e.key.toLowerCase() === 's') {
      e.preventDefault()
      onSave(page)
    } else if (metaKey && e.shiftKey && e.key.toLowerCase() === 'z') {
      if (snapshotIndex < snapshots.length - 1) {
        changeSnapShot(snapshotIndex + 1)
      }
    } else if (metaKey && e.key.toLowerCase() === 'z') {
      if (snapshotIndex > 0) {
        changeSnapShot(snapshotIndex - 1)
      }
    }
  })
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
            {screens.map((screenNode: ComponentRenderNode<ScreenProps>) => (
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
            ))}
          </Radio.Group>
          <Divider type="vertical" className="h-7" />
          <Tooltip
            title={`按下 ${
              isMac ? 'command' : 'ctrl'
            } 键操作可阻止自定义事件触发`}
            placement="bottom"
          >
            <Button
              size="small"
              type="text"
              icon={<QuestionCircleOutlined />}
            />
          </Tooltip>
          <ModalButton
            modalProps={{
              width: '100vw',
              style: {
                top: 10,
              },
              bodyStyle: {
                height: '80vh',
              },
            }}
            modalTitle="预览"
            modal={<PageView page={page} />}
            size="small"
          >
            预览
          </ModalButton>
          <Tooltip
            title={`${isMac ? 'command' : 'ctrl'} + s`}
            placement="bottom"
          >
            <Button size="small" type="primary" onClick={() => onSave(page)}>
              保存
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default SimulatorToolbar
