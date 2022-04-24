import { ConfigType, registerAs } from '@nestjs/config'

export const emailConfig = registerAs('email', () => ({
  host: process.env.Email_INCOMING_HOST,
  port: Number.parseInt(process.env.Email_INCOMING_PORT),
  username: process.env.Email_INCOMING_USER,
  email: process.env.Email_INCOMING_EMAIL,
  password: process.env.Email_INCOMING_PASS,
}))

export type EmailConfig = ConfigType<typeof emailConfig>
