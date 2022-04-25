import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { BlockEntity } from './block.entity'
import { BlocksController } from './blocks.controller'
import { BlocksService } from './blocks.service'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity]), UsersModule],
  providers: [BlocksService],
  controllers: [BlocksController],
})
export class BlocksModules {}
