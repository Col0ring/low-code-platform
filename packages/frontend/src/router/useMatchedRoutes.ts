import { useMemo } from 'react'
import { useLocation, matchRoutes } from 'react-router-dom'
import { routes } from './routes'

export function useMatchedRoutes() {
  const location = useLocation()
  const matchedRoutes = useMemo(() => matchRoutes(routes, location), [location])
  return matchedRoutes
}

export default useMatchedRoutes
