import { IsNumber, IsOptional, IsString } from 'class-validator'
import { AppStatus } from '../constants'

export class AppUpdateDto {
  @IsString({
    message: 'Please input correct name',
  })
  @IsOptional()
  name: string

  @IsString({
    message: 'Please input correct desc',
  })
  @IsOptional()
  desc: string

  @IsString({
    message: 'Please input correct icon',
  })
  @IsOptional()
  icon: string

  @IsNumber(undefined, {
    message: 'Please input correct status',
  })
  @IsOptional()
  status: AppStatus
}
