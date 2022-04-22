import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class TemplateCreateDto {
  @IsNotEmpty({
    message: "content can't be empty",
  })
  @IsString({
    message: 'Please input correct content',
  })
  name: string

  @IsString({
    message: 'Please input correct content',
  })
  @IsOptional()
  icon: string

  @IsString({
    message: 'Please input correct content',
  })
  @IsOptional()
  desc: string

  @IsNumber(undefined, {
    message: 'Please input correct appId',
  })
  @IsNotEmpty({
    message: "appId can't be empty",
  })
  appId: number
}
