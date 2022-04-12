import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
  icon: string

  @IsString({
    message: 'Please input correct content',
  })
  desc: string

  @IsNumber(undefined, {
    message: 'Please input correct appId',
  })
  @IsNotEmpty({
    message: "appId can't be empty",
  })
  appId: number
}
