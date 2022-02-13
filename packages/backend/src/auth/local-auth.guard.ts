import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { StrategyType } from './constants'

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyType.Local) {}
