import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MAIL_QUEUE } from './mail.constants';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) { }

  async sendMail(sendMailDto: SendMailDto) {
    await this.mailQueue.add('send_mail', sendMailDto, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
