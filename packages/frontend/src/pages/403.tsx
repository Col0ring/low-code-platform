import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { Path } from '@/router/constants'

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="Forbidden"
      subTitle="You can't enter this page"
      extra={
        <Button
          type="primary"
          onClick={() =>
            navigate(Path.Dashboard, {
              replace: true,
            })
          }
        >
          Back to Home
        </Button>
      }
    />
  )
}

export default ForbiddenPage
