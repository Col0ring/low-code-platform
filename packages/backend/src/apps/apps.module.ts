import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { AppEntity } from './app.entity'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity]), UsersModule],
  providers: [AppsService],
  controllers: [AppsController],
  exports: [AppsService],
})
export class AppsModule {}
