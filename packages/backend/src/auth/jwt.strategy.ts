import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { StrategyType } from './constants'
import { AuthConfig, authConfig } from './auth.config'
import { JwtUser, TokenPayload } from './type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyType.Jwt) {
  constructor(
    @Inject(authConfig.KEY)
    authConfigService: AuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfigService.jwtSecret,
    })
  }

  // mount to req.user
  validate(payload: TokenPayload): JwtUser {
    return {
      id: payload.sub,
    }
  }
}
