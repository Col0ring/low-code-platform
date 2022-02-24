import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { StrategyType } from './constants'
import { User } from '../users/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  StrategyType.Local
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'passwordOrCode',
      passReqToCallback: true,
    })
  }

  async validate(req: Request, phone: string, passwordOrCode: string) {
    const type = req.query.type as 'password' | 'code'
    let user: null | Omit<User, 'password'>
    if (type === 'code') {
      // TODO
      user = await this.authService.validateUser(phone, '1')
    } else {
      user = await this.authService.validateUser(phone, passwordOrCode)
    }
    if (!user) {
      throw new BadRequestException('phone or password is wrong')
    }
    return user
  }
}
