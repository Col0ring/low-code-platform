import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator'
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsPhoneNumber('CN', {
    message: 'Please input correct phone',
  })
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string
}
