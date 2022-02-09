import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { strategyConstants } from './constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard(strategyConstants.jwt) {
  override handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}
