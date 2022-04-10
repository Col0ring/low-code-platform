import { SetMetadata } from '@nestjs/common'
import { DecoratorMetadata } from '../constants'

export const Public = () => SetMetadata(DecoratorMetadata.Public, true)
