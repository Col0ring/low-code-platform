import { IsString, IsNotEmpty, IsEmail } from 'class-validator'
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsEmail({
    message: 'Please input correct email',
  })
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
