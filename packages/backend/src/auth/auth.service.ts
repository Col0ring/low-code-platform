import {
  UnauthorizedException,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { authConfig, AuthConfig } from './auth.config'
import { TokenPayload, Tokens } from './type'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfigService: AuthConfig
  ) {}

  private generateTokens(id: number): Tokens {
    const payload: TokenPayload = { sub: id }
    return {
      token: this.jwtService.sign(payload, {
        expiresIn: this.authConfigService.jwtExpressIn,
        secret: this.authConfigService.jwtSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.authConfigService.refreshTokenJwtExpressIn,
        secret: this.authConfigService.refreshTokenJwtSecret,
      }),
    }
  }

  async validateUser(phone: string, password: string) {
    const user = await this.usersService.findOneByPhoneWithPassword(phone)
    const { password: userPassword, ...result } = user
    if (user && bcrypt.compareSync(password, userPassword)) {
      return result
    }
    return null
  }

  async refreshTokens(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOneById(id)

    if (!user || refreshToken !== user.refreshToken) {
      throw new UnauthorizedException()
    }
    const tokens = this.generateTokens(id)
    await this.usersService.updateOneById(id, {
      refreshToken: tokens.refreshToken,
    })
    return tokens
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.usersService.insertUser(dto)
      const tokens = this.generateTokens(user.id)
      await this.usersService.updateOneById(user.id, {
        refreshToken: tokens.refreshToken,
      })
      return tokens
    } catch (error) {
      throw new BadRequestException('the phone has been registered')
    }
  }

  async login(id: number) {
    const tokens = this.generateTokens(id)
    await this.usersService.updateOneById(id, {
      refreshToken: tokens.refreshToken,
    })

    return tokens
  }

  async logout(id: number) {
    await this.usersService.updateOneById(id, {
      refreshToken: null,
    })
  }
}
