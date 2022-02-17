import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { StrategyType } from './constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.Jwt) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  override handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}
