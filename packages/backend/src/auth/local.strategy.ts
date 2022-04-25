import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { StrategyType } from './constants'
import { UserEntity } from '../users/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  StrategyType.Local
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'passwordOrCode',
      passReqToCallback: true,
    })
  }

  async validate(req: Request, email: string, passwordOrCode: string) {
    const type = req.query.type as 'password' | 'code'
    let user: null | Omit<UserEntity, 'password'>
    if (type === 'code') {
      user = await this.authService.validateUserByCode(email, passwordOrCode)
      if (!user) {
        throw new BadRequestException('auth code is wrong')
      }
      await this.authService.deleteAuthCode(email)
    } else {
      user = await this.authService.validateUser(email, passwordOrCode)
      if (!user) {
        throw new BadRequestException('email or password is wrong')
      }
    }

    return user
  }
}
