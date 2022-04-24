import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsOptional()
  avatar: string
}
