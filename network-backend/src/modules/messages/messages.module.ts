import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMember } from './entities/conversation-member.entity';
import { Message } from './entities/message.entity';
import { ConversationsService } from './services/conversations.service';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { ConversationsController } from './controllers/conversations.controller';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { IsMemberIdsValid } from './validators/is-memberIds.validator';
import { MessageRead } from './entities/message-read.entity';
import { SocketModule } from '@/socket/socket.module';
import { ConversationMembersService } from './services/conversation-members-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationMember, Message, MessageRead]),
    UsersModule,
    CloudinaryModule,
    SocketModule,
  ],
  providers: [
    ConversationsService,
    MembersService,
    MessagesService,
    IsMemberIdsValid,
    ConversationMembersService],
  controllers: [ConversationsController, MembersController, MessagesController],
})
export class MessagesModule { }
