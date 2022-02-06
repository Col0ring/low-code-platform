import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { strategyConstants } from './constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(strategyConstants.local) {}
