import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppEntity } from '../apps/app.entity'
import { PageEntity } from '../pages/page.entity'
import { UsersModule } from '../users/users.module'
import { TemplateEntity } from './template.entity'
import { TemplatesController } from './templates.controller'
import { TemplatesService } from './templates.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    TypeOrmModule.forFeature([AppEntity]),
    TypeOrmModule.forFeature([PageEntity]),
    UsersModule,
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
