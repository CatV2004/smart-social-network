import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { BcryptService } from '@/modules/auth/bcrypt.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';
import dayjs from 'dayjs';
import { ProfilesService } from '../profiles/profiles.service';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';
import { SearchService } from '../search/search.service';
import { UserSearchDto } from '../search/dtos/user-search.dto';
import { UserSearchMapper } from './mappers/user-search.mapper';
import { plainToInstance } from 'class-transformer';
import { UserStatus } from './types/UserStatus';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';


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
    private readonly searchService: SearchService,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  async findUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
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
        username: dto.username,
        password: hashedPassword,
      });

      this.generateVerificationTokenForUser(user);

      const savedUser = await queryRunner.manager.save(user);
      if (savedUser.role === UserRole.USER) {
        await this.profilesService.create({}, savedUser.id, queryRunner.manager);
      }
      await queryRunner.commitTransaction();

      // const userSearchDto: UserSearchDto = {
      //   id: savedUser.id,
      //   username: savedUser.username,
      //   fullName: `${savedUser.firstName} ${savedUser.lastName}`,
      //   email: savedUser.email,
      // };
      // this.searchService.addUser(userSearchDto).catch(err => {
      //   console.error('Failed to enqueue user indexing', err);
      // });

      await this.sendVerificationEmail(savedUser).catch(error => {
        this.logger.error(`Failed to send email, but user was created: ${error}`);
      });

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
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

  async updateStatus(userId: string, dto: UpdateUserStatusDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.status = dto.status;
    return await this.userRepository.save(user);
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
    try {
      this.logger.log("Start verifyEmail with token: " + token);

      this.logger.log(`Looking for user with token: ${token}`);
      const user = await this.userRepository.findOne({
        where: { verificationToken: token },
      });
      this.logger.log("User found: " + JSON.stringify(user));
      this.logger.log("After findOne");

      if (!user) {
        const alreadyVerified = await this.userRepository.findOne({
          where: { status: UserStatus.ACTIVE, isVerified: true, verificationToken: IsNull() },
        });
        if (alreadyVerified) {
          this.logger.warn(`Token already used. User ${alreadyVerified.email} is verified.`);
          return { message: 'Email already verified' };
        }

        throw new BadRequestException('Invalid verification token');
      }

      if (user.isVerified) {
        this.logger.log("User already verified");
        return { message: 'Email already verified' };
      }

      if (!user.isVerificationTokenValid()) {
        this.logger.log("Token expired");
        throw new BadRequestException('Verification token has expired');
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;

      try {
        await this.userRepository.save(user);
        this.logger.log("User saved successfully");
      } catch (err) {
        this.logger.error("Error when saving user", err.stack || err);
        throw err;
      }

      this.logger.log("line 162 before findByUserId");

      let profile;
      try {
        profile = await this.profilesService.findByUserId(user.id);
        this.logger.log("line 164 after findByUserId");
      } catch (err) {
        this.logger.error("Error when findByUserId", err.stack || err);
        throw err;
      }

      const userSearchDto: UserSearchDto = {
        id: user.id,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: profile?.avatar ?? null,
      };

      try {
        await this.searchService.addUser(userSearchDto);
        this.logger.log("User indexed in Elasticsearch");
      } catch (err) {
        this.logger.error("Failed to index verified user into Elasticsearch", err.stack || err);
      }

      this.logger.log(`Email verified for ${user.email}`);
      return { message: 'Email successfully verified' };
    } catch (err) {
      this.logger.error("verifyEmail failed", err.stack || err);
      throw err; // ném lại để controller trả về response lỗi
    }
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
      select: ['id', 'email', 'firstName', 'lastName', 'password', 'role', 'isVerified', 'status'],
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

  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return await this.userRepository.find({
      where: { id: In(ids) },
    });
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

  async findByUsernameOrEmail(identifier: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findAllActivePaged(options: { limit: number; offset: number }) {
    const [items, total] = await this.userRepository.findAndCount({
      where: { status: UserStatus.ACTIVE },
      relations: ['profile'],
      take: options.limit,
      skip: options.offset,
      order: { createdAt: 'DESC' },
    });

    const userSearchItems = UserSearchMapper.toDtos(items);

    const nextOffset = options.offset + options.limit < total
      ? options.offset + options.limit
      : null;

    return {
      items: userSearchItems,
      total,
      nextOffset
    };
  }

}