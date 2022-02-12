export function matchRoles(roles: string[], routeRoles: string[]) {
  return roles.some((role) => routeRoles.includes(role))
}
