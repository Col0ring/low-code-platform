import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { ensureArray } from '@/utils'
import { useAuth } from '@/hooks'
import { Role } from '@/features/auth/constants'
import { useGetUserInfoQuery } from '@/features/auth/auth.service'
import RouteLoading, { RouteLoadingProps } from './route-loading'
import ForbiddenPage from './pages/403'
import { Path } from './constants'

function matchRoles(roles: string[], routeRoles?: string[]) {
  return (
    roles.includes(Role.Admin) ||
    !routeRoles ||
    routeRoles.some((routeRole) => roles.includes(routeRole))
  )
}

export interface AuthProps {
  roles?: Role | Role[]
  needAuth: true
  navigateWhenForbidden?: true
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
    Omit<AuthProps, 'needAuth' | 'navigateWhenForbidden'>,
    Omit<PublicProps, 'needAuth'> {
  needAuth: boolean
  navigateWhenForbidden: boolean
}

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  const {
    element,
    navigateWhenForbidden,
    loading: loadingProp,
    roles: routeRoles,
    loadingFullScreen,
    needAuth,
    notLogin,
    redirect = notLogin ? Path.Dashboard : Path.Login,
  } = props as InternalProps

  const loading = loadingProp ?? true
  const location = useLocation()

  const auth = useAuth()
  const { hasToken } = auth
  // 登出或者没有登录过 hasToken 为 false
  const { isLoading, data } = useGetUserInfoQuery(
    !hasToken ? skipToken : !needAuth
  )

  const user = hasToken ? data || auth.user : auth.user

  if (isLoading && loading) {
    return <RouteLoading loadingFullScreen={loadingFullScreen} />
  }

  if (notLogin && user) {
    return <Navigate replace to={redirect} />
  }
  if (needAuth) {
    if (user) {
      if (matchRoles(user.roles, routeRoles && ensureArray(routeRoles))) {
        return <>{element}</>
      }

      if (navigateWhenForbidden) {
        return <Navigate replace to={Path.Forbidden} />
      }
      return <ForbiddenPage />
    }

    return (
      <Navigate
        replace
        state={location.state}
        to={`${redirect}?redirect=${location.pathname + location.search}`}
      />
    )
  }
  return <>{element}</>
}
export default AuthRoute
