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
import { LocalUser, TokenPayload, Tokens } from './type'
import { RegisterDto } from './dto/register.dto'
import { Role } from './constants'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserUpdateDto } from './dto/user-update.dto'
import { CommonRedisService } from '../database/redis.service'
import { generateAuthCode } from './utils'
import { EmailService } from '../email/email.service'

const fakeRoles = [Role.Admin, Role.User]
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfigService: AuthConfig,
    private readonly commonRedisService: CommonRedisService,
    private readonly emailService: EmailService
  ) {}

  private generateTokens(payload: TokenPayload): Tokens {
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

  async setAuthCode(email: string) {
    const code = generateAuthCode(6)
    await this.commonRedisService.set('email_' + email, code, 60 * 5)
    await this.emailService.sendMail(email, code)
    return code
  }

  deleteAuthCode(email: string) {
    return this.commonRedisService.del('email_' + email)
  }

  private getAuthCode(email: string) {
    return this.commonRedisService.get('email_' + email)
  }

  async validateUserByCode(email: string, code: string) {
    const userCode = await this.getAuthCode(email)
    if (code === userCode) {
      const user = await this.usersService.findOneByEmailWithPassword(email)
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user
        return result
      }
    }
    return null
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmailWithPassword(email)
    if (user) {
      const { password: userPassword, ...result } = user
      if (bcrypt.compareSync(password, userPassword)) {
        return result
      }
    }
    return null
  }

  async refreshTokens(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOneByIdWithRefreshToken(id)

    if (!user || refreshToken !== user.refreshToken) {
      throw new UnauthorizedException()
    }
    const tokens = this.generateTokens({
      sub: user.id,
      roles: fakeRoles,
    })
    await this.usersService.updateOneById(id, {
      refreshToken: tokens.refreshToken,
    })
    return tokens
  }
  async resetPassword(dto: ResetPasswordDto) {
    const userCode = await this.getAuthCode(dto.email)
    if (dto.code === userCode) {
      return await this.usersService.updateOneByEmail(dto.email, {
        password: dto.password,
        refreshToken: null,
      })
    }
    throw new BadRequestException('auth code is wrong')
  }
  async updateUser(id: number, dto: UserUpdateDto) {
    await this.usersService.updateOneById(id, dto)
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.usersService.insertUser(dto)
      const tokens = this.generateTokens({
        sub: user.id,
        roles: fakeRoles,
      })
      await this.usersService.updateOneById(user.id, {
        refreshToken: tokens.refreshToken,
      })
      return tokens
    } catch (error) {
      throw new BadRequestException('the phone has been registered')
    }
  }

  async login(user: LocalUser) {
    const tokens = this.generateTokens({
      sub: user.id,
      roles: fakeRoles,
    })
    await this.usersService.updateOneById(user.id, {
      refreshToken: tokens.refreshToken,
    })

    return tokens
  }

  async logout(id: number) {
    await this.usersService.updateOneById(id, {
      refreshToken: null,
    })
  }

  async getUserInfo(id: number) {
    return {
      ...(await this.usersService.findOneById(id)),
      roles: fakeRoles,
    }
  }
}
