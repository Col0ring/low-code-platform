import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'
import { StrategyType } from './constants'

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  StrategyType.Local
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
    })
  }

  async validate(phone: string, password: string) {
    const user = await this.authService.validateUser(phone, password)
    if (!user) {
      throw new BadRequestException('phone or password is wrong')
    }
    return user
  }
}
