import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class AppCreateByTemplateDto {
  @IsNotEmpty({
    message: "name can't be empty",
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
  @IsNotEmpty({
    message: "templateAppId can't be empty",
  })
  @IsNumber(undefined, {
    message: 'Please input correct templateAppId',
  })
  templateAppId: number
}
