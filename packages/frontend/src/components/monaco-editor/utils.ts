import * as monaco from 'monaco-editor'
import prettier from 'prettier/standalone'
import babelParser from 'prettier/parser-babel'
import {
  DiffEditOptions,
  DiffEditResources,
  EditOptions,
  FormatOptions,
} from './type'

const prettierPlugins = [babelParser]

export function computeOffset(code: string, position: monaco.Position) {
  let line = 1
  let col = 1
  let offset = 0
  while (offset < code.length) {
    if (line === position.lineNumber && col === position.column) {
      return offset
    }
    if (code[offset] === '\n') {
      line++
      col = 1
    } else {
      col++
    }
    offset++
  }
  return offset
}

export function computePosition(
  code: string,
  offset: number
): monaco.IPosition {
  let line = 1
  let col = 1
  let char = 0
  while (char < offset) {
    if (code[char] === '\n') {
      line++
      col = 1
    } else {
      col++
    }
    char++
  }
  return { lineNumber: line, column: col }
}

export function format(
  editor: monaco.editor.IStandaloneCodeEditor,
  options?: FormatOptions
) {
  const { onBefore, onAfter } = options || {}
  const value = editor.getValue()
  const position = editor.getPosition()
  const model = editor.getModel()
  if (!value || !position || !model) {
    return
  }
  const { cursorOffset, formatted } = prettier.formatWithCursor(value, {
    parser: 'babel',
    plugins: prettierPlugins,
    cursorOffset: computeOffset(value, position),
  })

  if (formatted === value) {
    return
  }
  onBefore?.()

  editor.executeEdits('delete', [
    {
      range: model.getFullModelRange(),
      text: '',
      forceMoveMarkers: true,
    },
  ])

  editor.executeEdits('prettier', [
    {
      range: new monaco.Range(0, 0, 0, 0),
      text: formatted,
      forceMoveMarkers: true,
    },
  ])

  editor.setSelection(new monaco.Range(0, 0, 0, 0))
  editor.setPosition(computePosition(formatted, cursorOffset))
  editor.pushUndoStop()
  onAfter?.(formatted)
}

export function edit(
  editor: monaco.editor.IStandaloneCodeEditor,
  value: string,
  options?: EditOptions
) {
  const { onBefore, onAfter } = options || {}
  const model = editor.getModel()
  if (!model) {
    return
  }
  if (value !== editor.getValue()) {
    onBefore?.()
    editor.executeEdits('edit', [
      {
        range: model.getFullModelRange(),
        text: value,
        forceMoveMarkers: true,
      },
    ])
    editor.focus()
    editor.pushUndoStop()
    onAfter?.()
  }
}

export function formatDiff(
  editor: monaco.editor.IStandaloneDiffEditor,
  options: FormatOptions
) {
  const { onBefore, onAfter } = options || {}

  const { modified } = editor.getModel() || {}
  if (!modified) {
    return
  }
  const modifiedEditor = editor.getModifiedEditor()
  const position = modifiedEditor.getPosition()
  if (!position) {
    return
  }
  const value = modified.getValue()
  const { cursorOffset, formatted } = prettier.formatWithCursor(value, {
    parser: 'babel',
    plugins: prettierPlugins,
    cursorOffset: computeOffset(value, position),
  })
  if (formatted !== value) {
    onBefore?.()

    modifiedEditor.executeEdits('delete', [
      {
        range: modified.getFullModelRange(),
        text: '',
        forceMoveMarkers: true,
      },
    ])

    modifiedEditor.executeEdits('prettier', [
      {
        range: new monaco.Range(0, 0, 0, 0),
        text: formatted,
        forceMoveMarkers: true,
      },
    ])

    modifiedEditor.setSelection(new monaco.Range(0, 0, 0, 0))
    modifiedEditor.setPosition(computePosition(formatted, cursorOffset))
    modifiedEditor.pushUndoStop()
    onAfter?.(formatted)
  }
}

export function editDiff(
  editor: monaco.editor.IStandaloneDiffEditor,
  resources: DiffEditResources,
  options?: DiffEditOptions
) {
  const { originalValue, modifiedValue } = resources || {}
  const {
    onOriginalBefore,
    onOriginalAfter,
    onModifiedBefore,
    onModifiedAfter,
  } = options || {}
  const { modified, original } = editor.getModel() || {}
  if (original && originalValue !== original.getValue()) {
    onOriginalBefore?.()
    original.setValue(originalValue)
    onOriginalAfter?.()
  }
  if (modified && modifiedValue !== modified.getValue()) {
    onModifiedBefore?.()
    const modifiedEditor = editor.getModifiedEditor()
    modifiedEditor.executeEdits('edit', [
      {
        range: modified.getFullModelRange(),
        text: modifiedValue,
        forceMoveMarkers: true,
      },
    ])
    modifiedEditor.focus()
    modifiedEditor.pushUndoStop()
    onModifiedAfter?.()
  }
}
