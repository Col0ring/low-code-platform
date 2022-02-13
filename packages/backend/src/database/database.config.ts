import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigType, registerAs } from '@nestjs/config'

export const databaseConfig = registerAs('database', () => ({
  type: (process.env.DATABASE_TYPE || 'mysql') as TypeOrmModuleOptions['type'],
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number.parseInt(process.env.DATABASE_PORT) || 3366,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '123456',
}))

export type DatabaseConfig = ConfigType<typeof databaseConfig>
