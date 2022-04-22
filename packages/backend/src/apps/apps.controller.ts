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
  Put,
  BadRequestException,
  Response,
  ForbiddenException,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'
import { PageStatus } from 'src/pages/constants'
import { Auth, Public, User } from '../auth/decorators'
import { JwtUser } from '../auth/type'
import { AppsService } from './apps.service'
import { AppStatus, SearchAppStatus } from './constants'
import { AppCreateDto } from './dto/create.dto'
import { AppSearchDto } from './dto/search.dto'
import { AppCreateByTemplateDto } from './dto/templateCreate.dto'
import { AppUpdateDto } from './dto/update.dto'

// TODO: user => app
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
      searchStatus: body?.searchStatus ?? SearchAppStatus.All,
    })
    return {
      data,
      count,
    }
  }
  @Get('/build/:appId')
  async buildApp(
    @Param('appId', ParseIntPipe) appId: number,
    @Response() res: ExpressResponse
  ) {
    const app = await this.appsService.one(appId)
    if (app) {
      const buffer = await this.appsService.buildApp({
        title: app.name,
        pages: app.pages
          .filter((page) => page.status === PageStatus.Active)
          .map((page) => ({
            path: page.path,
            content: page.content,
          })),
      })
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader(
        'Content-Disposition',
        `attachment;filename=${encodeURIComponent(
          app.name || 'dist'
        )}.zip;filename*=UTF-8`
      )
      res.send(buffer)
      return
    }

    throw new BadRequestException('app not found')
  }
  @Post('create')
  create(@Body() appCreateDto: AppCreateDto, @User() user: JwtUser) {
    return this.appsService.create(user.id, appCreateDto)
  }

  @Post('createByTemplate')
  createByTemplate(
    @Body() appCreateByTemplateDto: AppCreateByTemplateDto,
    @User() user: JwtUser
  ) {
    return this.appsService.createByTemplate(user.id, appCreateByTemplateDto)
  }

  @Put('update/:appId')
  update(
    @Param('appId', ParseIntPipe) appId: number,
    @Body() appUpdateDto: AppUpdateDto
  ) {
    return this.appsService.update(appId, appUpdateDto)
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.appsService.delete(id)
  }

  @Get('one/:id')
  one(@Param('id', ParseIntPipe) id: number) {
    return this.appsService.one(id)
  }

  @Get('view/:id')
  @Public()
  async view(@Param('id', ParseIntPipe) id: number) {
    const app = await this.appsService.one(id)
    if (app.status === AppStatus.Active) {
      return app
    }
    throw new ForbiddenException()
  }
}
