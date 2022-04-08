import { IsNumber, IsString } from 'class-validator'
import { SearchAppStatus } from '../constants'

export class AppSearchDto {
  @IsString({
    message: 'Please input correct content',
  })
  search: string

  @IsString({
    message: 'Please input correct content',
  })
  searchOrder: string

  @IsNumber(undefined, {
    message: 'Please input correct content',
  })
  searchStatus: SearchAppStatus
}
