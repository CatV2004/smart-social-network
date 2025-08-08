import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '@/modules/auth/bcrypt.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';
import dayjs from 'dayjs';
import { ProfilesService } from '../profiles/profiles.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly frontendUrl: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly profilesService: ProfilesService,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'isVerified', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new UserResponseDto(user);
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: dto.email },
        withDeleted: true,
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await this.bcryptService.hash(dto.password);

      const user = queryRunner.manager.create(User, {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword,
      });

      this.generateVerificationTokenForUser(user);

      const savedUser = await queryRunner.manager.save(user);
      if (savedUser.role === UserRole.USER) {
        await this.profilesService.create({}, savedUser.id, queryRunner.manager);
      }
      await queryRunner.commitTransaction();

      await this.sendVerificationEmail(savedUser).catch(error => {
        this.logger.error(`Failed to send email, but user was created: ${error}`);
      });

      return new UserResponseDto(savedUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`User creation failed: ${error.message}`, error.stack);
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('User registration failed');
    } finally {
      await queryRunner.release();
    }
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    if (!user.verificationToken) {
      throw new Error('Verification token is missing');
    }

    const verificationUrl = `${this.frontendUrl}/verify-email?token=${user.verificationToken}`;
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Email Verification',
      template: 'verify-email',
      context: {
        name: `${user.firstName} ${user.lastName}` || 'User',
        username: `${user.email}`,
        timestamp,
        verificationUrl,
      },
    });

    this.logger.log(`Verification email queued for ${user.email}`);
  }


  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    if (!user.isVerificationTokenValid()) {
      throw new BadRequestException('Verification token has expired');
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await this.userRepository.save(user);

    this.logger.log(`Email verified for ${user.email}`);
    return { message: 'Email successfully verified' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    this.generateVerificationTokenForUser(user);

    await this.userRepository.save(user);

    await this.sendVerificationEmail(user);

    return { message: 'Verification email resent successfully' };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'password', 'role', 'isVerified', 'isActive'],
    });
  }

  private generateVerificationTokenForUser(user: User): void {
    const expiresInSeconds = parseInt(this.configService.get<string>('VERIFICATION_TOKEN_EXPIRES_IN_SECONDS') || '60', 10);
    user.verificationToken = uuidv4();
    user.verificationTokenExpires = dayjs().add(expiresInSeconds, 'second').toDate();
  }

  async findById(id: string, manager?: EntityManager): Promise<User> {
    const userRepo = manager?.getRepository(User) ?? this.userRepository;

    const user = await userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByUsername(userName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userName }
    })
    if (!user)
      throw new NotFoundException("User not found");

    return user;
  }
}