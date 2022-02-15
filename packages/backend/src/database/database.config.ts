import { ConfigType, registerAs } from '@nestjs/config'

export const databaseConfig = registerAs('database', () => ({
  type: 'mysql' as const,
  host: process.env.DATABASE_HOST || '127.0.0.1',
  database: process.env.DATABASE || 'nestjs-database',
  port: Number.parseInt(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '123456',
}))

export type DatabaseConfig = ConfigType<typeof databaseConfig>
