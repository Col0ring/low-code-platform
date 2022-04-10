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
  private isPublic = false
  constructor(private readonly reflector: Reflector) {
    super()
  }
  override canActivate(context: ExecutionContext) {
    this.isPublic = this.reflector.getAllAndOverride<boolean>(
      DecoratorMetadata.Public,
      [context.getHandler(), context.getClass()]
    )
    if (this.isPublic) {
      return true
    }
    return super.canActivate(context)
  }
  override handleRequest(err: any, user: any, info: any) {
    if (this.isPublic) {
      return
    }
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}
