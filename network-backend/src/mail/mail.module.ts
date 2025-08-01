import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from './mail.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
