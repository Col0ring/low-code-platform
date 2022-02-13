import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { databaseConfig } from './database/database.config'
import { authConfig } from './auth/auth.config'
import { __DEV__ } from './constants'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __DEV__ ? '.dev.env' : '.prod.env',
      load: [databaseConfig, authConfig],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // global guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
