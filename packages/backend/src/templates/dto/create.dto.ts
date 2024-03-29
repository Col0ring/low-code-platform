import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class TemplateCreateDto {
  @IsNotEmpty({
    message: "content can't be empty",
  })
  @IsString({
    message: 'Please input correct name',
  })
  name: string

  @IsString({
    message: 'Please input correct icon',
  })
  @IsOptional()
  icon: string

  @IsString({
    message: 'Please input correct desc',
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
