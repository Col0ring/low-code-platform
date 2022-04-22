import EditorPreview from '@/features/visual-editor/components/editor-preview'
import React, { useEffect, useState } from 'react'

const PageShowView: React.FC = () => {
  const [page, setPage] = useState(window.page)
  useEffect(() => {
    function fn() {
      setPage(window.page)
    }
    self.addEventListener('message', fn)
    return () => self.removeEventListener('message', fn)
  }, [])
  return <EditorPreview page={page} />
}

export default PageShowView
