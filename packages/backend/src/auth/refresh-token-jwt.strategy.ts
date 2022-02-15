import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { StrategyType } from './constants'
import { AuthConfig, authConfig } from './auth.config'
import { RefreshTokenJwtUser, TokenPayload } from './type'

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  StrategyType.RefreshTokenJwt
) {
  constructor(
    @Inject(authConfig.KEY)
    authConfigService: AuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfigService.refreshTokenJwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: TokenPayload): RefreshTokenJwtUser {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim()
    return {
      id: payload.sub,
      refreshToken,
    }
  }
}
