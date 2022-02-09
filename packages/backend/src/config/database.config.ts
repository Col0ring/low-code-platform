import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: process.env.DATABASE_PORT || 3366,
}))
