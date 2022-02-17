import { User } from '../users/user.entity'
import { Role } from './constants'

export interface Tokens {
  token: string
  refreshToken: string
}

export interface TokenPayload {
  sub: number
  roles: Role[]
}

export type LocalUser = Omit<User, 'password'>

export interface JwtUser {
  id: number
  roles: Role[]
}

export interface RefreshTokenJwtUser {
  id: number
  refreshToken: string
  roles: Role[]
}
