import path from 'path'
import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { EmailService } from './email.service'
import { EmailConfig, emailConfig } from './email.config'
const EmailDataBaseModule = MailerModule.forRootAsync({
  useFactory: (emailConfig: EmailConfig) => ({
    transport: {
      host: emailConfig.host,
      port: emailConfig.port,
      ignoreTLS: true,
      secure: false,
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
      },
    },
    defaults: {
      subject: 'Low-Code-Platform 验证码',
      from: `"${emailConfig.username}" <${emailConfig.email}>`,
    },
    template: {
      dir: path.resolve(__dirname, '../../email-templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [emailConfig.KEY],
})
@Module({
  imports: [EmailDataBaseModule],
  providers: [EmailService],
  exports: [EmailDataBaseModule, EmailService],
})
export class EmailModule {}
