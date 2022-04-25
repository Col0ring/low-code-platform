import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AppCreateDto {
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

  @IsOptional()
  @IsString({
    message: 'Please input correct desc',
  })
  desc: string
}
