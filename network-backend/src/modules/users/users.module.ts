import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { BcryptService } from '../auth/bcrypt.service';
import { MailModule } from '@/mail/mail.module';
import { ProfilesModule } from '../profiles/profiles.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfilesModule),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptService],
  exports: [UsersService]
})
export class UsersModule { }