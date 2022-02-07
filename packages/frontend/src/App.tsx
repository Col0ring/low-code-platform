import { useState } from 'react'
import { DiffMonacoEditor, MonacoEditor } from '@/components/monaco-editor'
const style = { width: '100%', height: 1000 }
function App() {
  const [v, setV] = useState("function hello() {alert('Hello world!')}")

  return (
    <div className="App">
      <button onClick={() => setV('222')}>aaa</button>
      <MonacoEditor
        style={style}
        theme="vs-dark"
        onChange={(vv) => {
          setV(vv)
        }}
        language="javascript"
        value={v}
      />
    </div>
  )
}

export default App
