import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

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
  @IsOptional()
  content: string

  @IsNumber(undefined, {
    message: 'Please input correct appId',
  })
  @IsNotEmpty({
    message: "appId can't be empty",
  })
  appId: number
}
