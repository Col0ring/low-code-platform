import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { CommonController } from './common.controller'
import dayjs from 'dayjs'
import { diskStorage } from 'multer'
import { getFilename } from './utils'
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: `uploads/${dayjs().format('YYYY-MM-DD')}`,
        filename: getFilename,
      }),
      preservePath: true,
    }),
  ],
  controllers: [CommonController],
})
export class CommonModule {}
