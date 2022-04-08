import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { PageCreateDto } from './dto/create.dto'
import { PageUpdateDto } from './dto/update.dto'
import { PagesService } from './pages.service'

@Controller('/pages')
@Auth()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}
  @Post('create')
  create(@Body() pageCreateDto: PageCreateDto) {
    return this.pagesService.create(pageCreateDto)
  }
  @Get('one/:appId/:pageId')
  one(
    @Param('appId', ParseIntPipe) appId: number,
    @Param('pageId', ParseIntPipe) pageId: number
  ) {
    return this.pagesService.one(appId, pageId)
  }

  @Put('update/:appId/:pageId')
  update(
    @Param('appId', ParseIntPipe) appId: number,
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() pageUpdateDto: PageUpdateDto
  ) {
    return this.pagesService.update(appId, pageId, pageUpdateDto)
  }

  @Delete('delete/:appId/:pageId')
  delete(
    @Param('appId', ParseIntPipe) appId: number,
    @Param('pageId', ParseIntPipe) pageId: number
  ) {
    return this.pagesService.delete(appId, pageId)
  }
}
