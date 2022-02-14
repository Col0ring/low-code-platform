import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { DecoratorMetadata, StrategyType } from './constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.Jwt) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(
      DecoratorMetadata.Public,
      [context.getHandler(), context.getClass()]
    )

    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  override handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}
