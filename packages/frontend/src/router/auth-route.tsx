import React from 'react'
import { Navigate } from 'react-router-dom'
import { ensureArray } from '@/utils'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Role, useAppSelector } from '@/store'
import { useGetUserInfoQuery } from '@/store/services/auth'
import { matchRoles } from './utils'
import RouteLoading, { RouteLoadingProps } from './route-loading'

export interface AuthProps {
  roles?: Role | Role[]
  needAuth: true
}
export interface PublicProps {
  needAuth: false
  notLogin?: true
  loading?: false
}

export type AuthRouteProps = RouteLoadingProps & {
  element: React.ReactNode
  redirect?: string
} & (AuthProps | PublicProps)

interface InternalProps
  extends Omit<AuthRouteProps, 'needAuth'>,
    Omit<AuthProps, 'needAuth'>,
    Omit<PublicProps, 'needAuth'> {
  needAuth: boolean
}

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  const {
    element,
    loading: originLoading,
    roles: routeRoles = [],
    loadingFullScreen,
    needAuth,
    notLogin,
    redirect = notLogin ? '/dashboard' : '/login',
  } = props as InternalProps

  const loading = originLoading ?? true

  const auth = useAppSelector((state) => state.auth)

  const { isLoading, data } = useGetUserInfoQuery(
    auth.user ? skipToken : !needAuth,
    {
      refetchOnFocus: false,
    }
  )
  const user = data || auth.user

  if (isLoading && loading) {
    return <RouteLoading loadingFullScreen={loadingFullScreen} />
  }

  if (notLogin && user) {
    return <Navigate replace to={redirect} />
  }

  if (needAuth) {
    if (user && matchRoles(user.roles, ensureArray(routeRoles))) {
      return <>{element}</>
    }
    return <Navigate replace to={redirect} />
  }

  return <>{element}</>
}
export default AuthRoute
