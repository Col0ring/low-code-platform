import { Module } from '@nestjs/common'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
  databaseConfig,
  DatabaseConfig,
  redisConfig,
  RedisConfig,
} from './database.config'
import { CommonRedisService } from './redis.service'

const TypeOrmDataBaseModule = TypeOrmModule.forRootAsync({
  useFactory(databaseConfigService: DatabaseConfig) {
    return {
      type: databaseConfigService.type,
      host: databaseConfigService.host,
      port: databaseConfigService.port,
      username: databaseConfigService.username,
      password: databaseConfigService.password,
      database: databaseConfigService.database,
      autoLoadEntities: true,
      synchronize: true,
    }
  },
  inject: [databaseConfig.KEY],
})

const RedisDataBaseModule = RedisModule.forRootAsync({
  useFactory(redisConfigService: RedisConfig) {
    return {
      config: {
        port: redisConfigService.port,
        host: redisConfigService.host,
      },
    }
  },
  inject: [redisConfig.KEY],
})
@Module({
  imports: [TypeOrmDataBaseModule, RedisDataBaseModule],
  providers: [CommonRedisService],
  exports: [TypeOrmDataBaseModule, RedisDataBaseModule, CommonRedisService],
})
export class DatabaseModule {}
