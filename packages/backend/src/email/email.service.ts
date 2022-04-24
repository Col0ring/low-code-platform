import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import dayjs from 'dayjs'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(email: string, code: string) {
    return this.mailerService.sendMail({
      to: email,
      template: 'validate.code.hbs',
      context: {
        // Data to be sent to template engine.
        code,
        date: dayjs().format('YYYY年MM月DD日 HH:mm:ss'), //日期
        sign: '此为系统邮件,请勿回复。', //发送的签名,当然也可以不要
      },
    })
  }
}
