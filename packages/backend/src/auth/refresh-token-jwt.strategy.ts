import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { StrategyType } from './constants'
import { AuthConfig, authConfig } from './auth.config'

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
    })
  }

  // mount to req.user
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}
