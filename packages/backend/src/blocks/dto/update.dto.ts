import { IsNotEmpty, IsString } from 'class-validator'

export class BlockUpdateDto {
  @IsNotEmpty({
    message: "name can't be empty",
  })
  @IsString({
    message: 'Please input correct name',
  })
  name: string
}
