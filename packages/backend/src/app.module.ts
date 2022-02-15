import { Module } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { databaseConfig } from './database/database.config'
import { authConfig } from './auth/auth.config'
import { __DEV__ } from './constants'
import { DatabaseModule } from './database/database.module'
import { AllExceptionsFilter } from './filters/all-exception.filter'
import { ValidationPipe } from './pipes/validation.pipe'

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
    // global exception
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
