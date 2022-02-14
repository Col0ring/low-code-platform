import React, { useEffect } from 'react'
import { useGetUserInfoQuery } from '@/store/services/auth'
import { useLazyGetUserListQuery } from '@/store/services/user'

const EditPage: React.FC = () => {
  useGetUserInfoQuery()
  const [trigger, { data }] = useLazyGetUserListQuery()
  useEffect(() => {
    setTimeout(() => {
      void trigger()
    }, 1000)
  }, [trigger])

  return <div>{data?.data}-test</div>
}

export default EditPage
