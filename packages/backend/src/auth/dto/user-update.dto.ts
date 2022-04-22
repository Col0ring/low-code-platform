import { IsString, IsNotEmpty } from 'class-validator'
export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  username: string
}
