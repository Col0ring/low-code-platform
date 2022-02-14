import {
  Controller,
  ForbiddenException,
  Get,
  Header,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('auth')
export class AuthController {
  @Get('/getUserInfo')
  getUserInfo(@Request() req: any) {
    if (req.headers.authorization) {
      return {}
    } else {
      throw new UnauthorizedException()
    }
  }
  @Post('/refreshToken')
  refreshToken() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          token: '1123',
          refreshToken: '123',
        })
        // reject(new UnauthorizedException('Ret'))
        // throw new ForbiddenException()
      }, 5000)
    })
  }
  @Get('/getUserList')
  getUserList() {
    return {
      data: 'list',
    }
  }
}
