import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { User } from './decorators/user.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.appService.getHello()
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@User() user: any) {
    return this.authService.login(user)
  }

  @Post()
  getCpu(@Body() body: any) {
    console.log(body)
    return 'ok'
  }
}
