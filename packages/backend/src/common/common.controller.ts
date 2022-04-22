import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('common')
export class CommonController {
  // 普通上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile('file') file: Express.Multer.File) {
    return {
      url: `http://localhost:3000/${file.path}`,
      file,
    }
  }
}
