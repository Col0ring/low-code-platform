import { IsNotEmpty, IsString } from 'class-validator'

export class AppCreateDto {
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
}
