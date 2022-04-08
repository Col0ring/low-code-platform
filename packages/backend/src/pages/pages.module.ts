import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppsModule } from 'src/apps/apps.module'
import { PageEntity } from './page.entity'
import { PagesController } from './pages.controller'
import { PagesService } from './pages.service'

@Module({
  imports: [AppsModule, TypeOrmModule.forFeature([PageEntity])],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [PagesService],
})
export class PagesModule {}
