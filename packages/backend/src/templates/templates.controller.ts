import {
  Controller,
  ParseIntPipe,
  Query,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common'
import { JwtUser } from '../auth/type'
import { Auth, User } from '../auth/decorators'
import { TemplatesService } from './templates.service'
import { TemplateCreateDto } from './dto/create.dto'
import { TemplateUpdateDto } from './dto/update.dto'

@Controller('templates')
@Auth()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}
  @Get('list')
  async list(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string
  ) {
    const [data, count] = await this.templatesService.list(
      pageSize,
      page,
      search || ''
    )
    return {
      data,
      count,
    }
  }

  @Get('myList')
  async myList(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string,
    @User() user: JwtUser
  ) {
    const [data, count] = await this.templatesService.myList(
      user.id,
      pageSize,
      page,
      search || ''
    )
    return {
      data,
      count,
    }
  }
  @Post('create')
  async create(
    @Body() templatesCreateDto: TemplateCreateDto,
    @User() user: JwtUser
  ) {
    return this.templatesService.create(user.id, templatesCreateDto)
  }
  @Put('update/:templateId')
  async update(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() templatesUpdateDto: TemplateUpdateDto
  ) {
    return this.templatesService.update(templateId, templatesUpdateDto)
  }
}
