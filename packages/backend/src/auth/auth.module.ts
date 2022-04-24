import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { UsersModule } from '../users/users.module'
import { StrategyType } from './constants'
import { RefreshTokenJwtStrategy } from './refresh-token-jwt.strategy'
import { AuthController } from './auth.controller'
import { DatabaseModule } from '../database/database.module'
import { EmailModule } from 'src/email/email.module'

@Module({
  imports: [
    EmailModule,
    DatabaseModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: StrategyType.Jwt }),
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenJwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
