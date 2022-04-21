import React from 'react'
import { Alert, Button } from 'antd'

export interface ErrorBoundaryProps {
  fallback?: React.ReactNode
  showError?: boolean
}

const initialState = {
  hasError: false,
  error: null as Error | null,
}

export class ErrorBoundary extends React.PureComponent<
  ErrorBoundaryProps,
  typeof initialState
> {
  readonly state: Readonly<typeof initialState> = initialState
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    const { fallback, showError, children } = this.props
    const { error, hasError } = this.state
    const message = showError ? error?.message : 'Something Wrong!'
    const description = showError
      ? error?.stack
      : 'it looks like there are some problems, please try again later.'
    if (hasError) {
      return (
        fallback || (
          <Alert
            message={message}
            description={
              <div>
                {description}
                <div className="flex justify-end mt-2">
                  <Button
                    danger
                    type="primary"
                    onClick={() => {
                      this.setState(initialState)
                    }}
                  >
                    Reload
                  </Button>
                </div>
              </div>
            }
            type="error"
            showIcon
          />
        )
      )
    }
    return children
  }
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function WithErrorBoundary<P = {}>(props: ErrorBoundaryProps = {}) {
  return (WrappedComponent: React.ComponentType<P>) => {
    // eslint-disable-next-line react/no-multi-comp
    class ErrorBoundaryWrapper extends React.PureComponent<
      P,
      typeof initialState
    > {
      readonly state: Readonly<typeof initialState> = initialState
      static getDerivedStateFromError(error: Error) {
        return {
          hasError: true,
          error,
        }
      }
      render() {
        const { fallback, showError } = props
        const { children, ...rest } = this.props
        const { error, hasError } = this.state
        const message = showError ? error?.message : 'Something Wrong!'
        const description = showError
          ? error?.stack
          : 'it looks like there are some problems, please try again later.'
        if (hasError) {
          return (
            fallback || (
              <Alert
                message={message}
                description={
                  <div>
                    {description}
                    <div className="flex justify-end mt-2">
                      <Button
                        danger
                        type="primary"
                        onClick={() => {
                          this.setState(initialState)
                        }}
                      >
                        Reload
                      </Button>
                    </div>
                  </div>
                }
                type="error"
                showIcon
              />
            )
          )
        }
        return <WrappedComponent {...(rest as P)}>{children}</WrappedComponent>
      }
    }
    return ErrorBoundaryWrapper
  }
}
