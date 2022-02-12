import React, { useEffect } from 'react'
import { counterActions, useAppDispatch, useAppSelector } from '@/store'

const EditPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(({ counter }) => counter.value)
  useEffect(() => {
    dispatch(counterActions.increment())
  }, [dispatch])
  useEffect(() => {
    console.log(count)
  }, [count])
  return <div>test</div>
}

export default EditPage
