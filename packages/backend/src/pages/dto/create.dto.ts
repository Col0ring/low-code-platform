import { Optional } from '@nestjs/common'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PageCreateDto {
  @IsNotEmpty({
    message: "name can't be empty",
  })
  @IsString({
    message: 'Please input correct name',
  })
  name: string

  @IsNotEmpty({
    message: "path can't be empty",
  })
  @IsString({
    message: 'Please input correct path',
  })
  path: string

  @IsString({
    message: 'Please input correct content',
  })
  @Optional()
  content: string

  @IsNumber(undefined, {
    message: 'Please input correct appId',
  })
  @IsNotEmpty({
    message: "appId can't be empty",
  })
  appId: number
}
