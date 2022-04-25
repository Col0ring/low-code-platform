import { IsString, IsPhoneNumber, IsNotEmpty, IsEmail } from 'class-validator'
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsPhoneNumber('CN', {
    message: 'Please input correct phone',
  })
  @IsNotEmpty()
  phone: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
