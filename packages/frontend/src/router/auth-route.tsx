import React from 'react'
import { Navigate } from 'react-router-dom'
import { ensureArray } from '@/utils'
import { useAppSelector } from '@/store'
import { matchRoles } from './utils'

export interface AuthRouteProps {
  render: () => React.ReactNode
  roles?: string | string[]
}
export const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  const { render, roles: routeRoles = [] } = props
  const { roles } = useAppSelector((state) => state.user)
  if (matchRoles(roles, ensureArray(routeRoles))) {
    return <>{render()}</>
  }
  return <Navigate replace to="/403" />
}
