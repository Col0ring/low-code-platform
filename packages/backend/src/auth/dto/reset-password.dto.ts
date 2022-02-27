import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator'
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsPhoneNumber('CN', {
    message: 'Please input correct phone',
  })
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string
}
