import { IsNumber, IsString } from 'class-validator'
import { PageStatus } from '../constants'

export class PageUpdateDto {
  @IsString({
    message: 'Please input correct name',
  })
  name: string

  @IsNumber(undefined, {
    message: 'Please input correct status',
  })
  status: PageStatus

  @IsString({
    message: 'Please input correct content',
  })
  content: string
}
