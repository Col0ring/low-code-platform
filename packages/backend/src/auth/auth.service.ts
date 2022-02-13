import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UsersService } from '../users/users.service'
import { authConfig, AuthConfig } from './auth.config'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfigService: AuthConfig
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.authConfigService.jwtExpressIn,
        secret: this.authConfigService.jwtSecret,
      }),
    }
  }
}
