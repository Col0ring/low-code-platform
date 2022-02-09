import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { strategyConstants, jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.jwt
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  // mount to req.user
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}
