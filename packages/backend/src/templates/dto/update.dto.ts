import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TemplateUpdateDto {
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
}
