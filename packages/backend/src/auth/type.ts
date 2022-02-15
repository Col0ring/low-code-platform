import { User } from '../users/user.entity'

export interface Tokens {
  token: string
  refreshToken: string
}

export interface TokenPayload {
  sub: number
}

export type LocalUser = Omit<User, 'password'>

export interface JwtUser {
  id: number
}

export interface RefreshTokenJwtUser {
  id: number
  refreshToken: string
}
