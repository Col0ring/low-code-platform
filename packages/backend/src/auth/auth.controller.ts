import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { User } from './decorators/user.decorator'
import { AuthService } from './auth.service'
import { Auth } from './decorators'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { RefreshTokenJwtAuthGuard } from './refresh-token-jwt-auth.guard'
import { JwtUser, LocalUser, RefreshTokenJwtUser } from './type'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserUpdateDto } from './dto/user-update.dto'
import { GetCodeDto } from './dto/get-code.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('/resetPassword')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @Auth()
  @Post('/updateUser')
  updateUser(@Body() dto: UserUpdateDto, @User() user: JwtUser) {
    return this.authService.updateUser(user.id, dto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User() user: LocalUser) {
    return this.authService.login(user)
  }

  @Post('/getAuthCode')
  async getUserList(@Body() body: GetCodeDto) {
    await this.authService.setAuthCode(body.email)
    return {
      message: 'ok',
    }
  }

  @Auth()
  @Post('/logout')
  async logout(@User() user: JwtUser) {
    await this.authService.logout(user.id)
  }

  @Auth()
  @Get('/getUserInfo')
  getUserInfo(@User() user: JwtUser) {
    return this.authService.getUserInfo(user.id)
  }

  @UseGuards(RefreshTokenJwtAuthGuard)
  @Post('/refreshToken')
  refreshTokens(@User() user: RefreshTokenJwtUser) {
    return this.authService.refreshTokens(user.id, user.refreshToken)
  }
}
