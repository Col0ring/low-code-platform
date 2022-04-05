import { Module } from '@nestjs/common'
import { AppsService } from './apps.service'

@Module({
  providers: [AppsService],
})
export class AppsModule {}
