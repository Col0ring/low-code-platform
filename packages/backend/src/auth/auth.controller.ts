import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { User } from '../decorators/user.decorator'
import { AuthService } from './auth.service'
import { Role } from './constants'
import { Auth } from './decorators'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { RefreshTokenJwtAuthGuard } from './refresh-token-jwt-auth.guard'
import { JwtUser, LocalUser, RefreshTokenJwtUser } from './type'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User() user: LocalUser) {
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@User() user: JwtUser) {
    await this.authService.logout(user.id)
  }

  @Auth(Role.User)
  @Get('/getUserInfo')
  getUserInfo() {
    return {
      roles: ['admin'],
    }
  }

  @UseGuards(RefreshTokenJwtAuthGuard)
  @Post('/refreshToken')
  refreshTokens(@User() user: RefreshTokenJwtUser) {
    return this.authService.refreshTokens(user.id, user.refreshToken)
  }

  @Get('/getUserList')
  getUserList() {
    return {
      data: 'list',
    }
  }
}
