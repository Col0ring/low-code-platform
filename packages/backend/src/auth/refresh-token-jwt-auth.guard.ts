import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { StrategyType } from './constants'

@Injectable()
export class RefreshTokenJwtAuthGuard extends AuthGuard(StrategyType.Jwt) {
  override handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}
