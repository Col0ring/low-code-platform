import { SetMetadata } from '@nestjs/common'
import { DecoratorMetadata, Role } from '../constants'

export const Roles = (...roles: Role[]) =>
  SetMetadata(DecoratorMetadata.Roles, roles)
