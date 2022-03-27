import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { Path } from '@/router/constants'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="Not Found"
      subTitle="The page does not exist"
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

export default NotFoundPage
