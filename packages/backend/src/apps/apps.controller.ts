import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Query,
  HttpCode,
  Delete,
  Param,
  Get,
} from '@nestjs/common'
import { Auth, User } from '../auth/decorators'
import { JwtUser } from '../auth/type'
import { AppsService } from './apps.service'
import { SearchAppStatus } from './constants'
import { AppCreateDto } from './dto/create.dto'
import { AppSearchDto } from './dto/search.dto'

@Controller('apps')
@Auth()
export class AppsController {
  constructor(private readonly appsService: AppsService) {}
  @Post('list')
  @HttpCode(200)
  async getList(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('page', ParseIntPipe) page: number,
    @User() user: JwtUser,
    @Body() body: AppSearchDto
  ) {
    const [data, count] = await this.appsService.list(user.id, pageSize, page, {
      search: body?.search || '',
      searchOrder: body?.searchOrder || 'update',
      searchStatus: body?.searchStatus || SearchAppStatus.All,
    })
    return {
      data,
      count,
    }
  }

  @Post('create')
  create(@Body() appCreateDto: AppCreateDto, @User() user: JwtUser) {
    return this.appsService.create(user.id, appCreateDto)
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.appsService.delete(id)
  }

  @Get('one/:id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.appsService.one(id)
  }
}
