import { useAppSelector } from '@/store'
import { useMemo } from 'react'
import { Role } from '../constants'

export function useAuth() {
  const auth = useAppSelector((state) => state.auth)
  return useMemo(
    () => ({
      ...auth,
      hasToken: !!(auth.token || auth.refreshToken),
      isAdmin: auth.roles.includes(Role.Admin),
    }),
    [auth]
  )
}

export default useAuth
