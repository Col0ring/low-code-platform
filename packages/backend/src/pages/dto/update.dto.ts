import { IsNumber, IsOptional, IsString } from 'class-validator'
import { PageStatus } from '../constants'

export class PageUpdateDto {
  @IsString({
    message: 'Please input correct name',
  })
  @IsOptional()
  name: string

  @IsNumber(undefined, {
    message: 'Please input correct status',
  })
  @IsOptional()
  status: PageStatus

  @IsString({
    message: 'Please input correct content',
  })
  @IsOptional()
  content: string

  @IsString({
    message: 'Please input correct path',
  })
  @IsOptional()
  path: string
}
