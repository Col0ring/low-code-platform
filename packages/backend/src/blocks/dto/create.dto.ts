import { IsNotEmpty, IsString } from 'class-validator'

export class BlockCreateDto {
  @IsNotEmpty({
    message: "name can't be empty",
  })
  @IsString({
    message: 'Please input correct name',
  })
  name: string

  @IsNotEmpty({
    message: "content can't be empty",
  })
  @IsString({
    message: 'Please input correct name',
  })
  content: string
}
