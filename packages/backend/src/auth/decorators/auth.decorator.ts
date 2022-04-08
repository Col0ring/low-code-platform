import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '../constants'
import { RolesGuard } from '../guards/roles.guard'
import { JwtAuthGuard } from '../jwt-auth.guard'
import { Roles } from './roles.decorator'

export function Auth(...roles: Role[]) {
  // 注意先后顺序
  return applyDecorators(
    Roles(...(roles.length === 0 ? [Role.User] : roles)),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}
