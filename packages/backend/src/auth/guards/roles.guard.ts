import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DecoratorMetadata, Role } from '../constants'
import { JwtUser } from '../type'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      DecoratorMetadata.Roles,
      [context.getHandler(), context.getClass()]
    )
    if (!requiredRoles) {
      return true
    }
    const user = context.switchToHttp().getRequest().user as JwtUser
    if (requiredRoles.some((role) => user.roles.includes(role))) {
      return true
    }
    throw new UnauthorizedException()
  }
}
