import { ConfigType, registerAs } from '@nestjs/config'

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpressIn: process.env.JWT_EXPRESS_IN || '',
  refreshTokenJwtSecret: process.env.REFRESH_TOKEN_JWT_SECRET || '',
  refreshTokenJwtExpressIn: process.env.REFRESH_TOKEN_JWT_EXPRESS_IN || '',
}))

export type AuthConfig = ConfigType<typeof authConfig>
