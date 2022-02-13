import path from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig, DatabaseConfig } from './database.config'

const TypeOrmDataBaseModule = TypeOrmModule.forRootAsync({
  useFactory(databaseConfigService: DatabaseConfig) {
    return {
      type: databaseConfigService.type,
      host: databaseConfigService.host,
      port: databaseConfigService.port,
      username: databaseConfigService.username,
      password: databaseConfigService.password,
      // auth load
      entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true,
    }
  },
  inject: [databaseConfig.KEY],
})

@Module({
  imports: [TypeOrmDataBaseModule],
  exports: [TypeOrmDataBaseModule],
})
export class DatabaseModule {}
