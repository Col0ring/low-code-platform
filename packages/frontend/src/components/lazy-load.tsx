import React, { Suspense } from 'react'
import { Spin } from 'antd'
import { ErrorBoundary } from './error-bondary'

export interface LazyLoadProps {
  fallback?: React.ReactNode
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children, fallback }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <Spin spinning />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default LazyLoad
