import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { JwtUser } from '../auth/type'
import { Auth, User } from '../auth/decorators'
import { BlocksService } from './blocks.service'
import { BlockCreateDto } from './dto/create.dto'
import { BlockUpdateDto } from './dto/update.dto'

@Controller('blocks')
@Auth()
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}
  @Get('list')
  async list(@Query('search') search: string, @User() user: JwtUser) {
    const [data, count] = await this.blocksService.list(user.id, search)
    return {
      data,
      count,
    }
  }
  @Post('create')
  create(@Body() blockCreateDto: BlockCreateDto, @User() user: JwtUser) {
    return this.blocksService.create(user.id, blockCreateDto)
  }

  @Put('update/:blockId')
  update(
    @Param('blockId', ParseIntPipe) blockId: number,
    @User() user: JwtUser,
    @Body() blockUpdateDto: BlockUpdateDto
  ) {
    return this.blocksService.update(blockId, user.id, blockUpdateDto)
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number, @User() user: JwtUser) {
    return this.blocksService.delete(id, user.id)
  }
}
