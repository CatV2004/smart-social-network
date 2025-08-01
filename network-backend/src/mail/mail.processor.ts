import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MAIL_QUEUE } from './mail.constants';
import { SendMailDto } from './dto/send-mail.dto';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Processor(MAIL_QUEUE)
@Injectable()
export class MailProcessor {
  private readonly transporter;
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly configService: ConfigService) {
    const config = {
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  @Process('send_mail')
  async handleSendMail(job: Job<SendMailDto>) {
    const { to, subject, template, context } = job.data;
    this.logger.log(`⏳ Sending email to ${to}...`);

    try {
      const html = this.compileTemplate(template, context);

      const info = await this.transporter.sendMail({
        to,
        subject,
        html,
        from: this.configService.get<string>('MAIL_FROM'),
      });

      this.logger.log(`✅ Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  private compileTemplate(templateName: string, context: any): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    return hbs.compile(source)(context);
  }
}
