import { IsString, IsNotEmpty, IsEmail } from 'class-validator'
export class GetCodeDto {
  @IsEmail({
    message: 'Please input correct phone',
  })
  @IsNotEmpty()
  email: string
}
