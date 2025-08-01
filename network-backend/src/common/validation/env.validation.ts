import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

import { Environment } from '../enums/environment.enum';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  // Database
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  // JWT
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message:
      'JWT_EXPIRES_IN must be a string like 15m, 7d, 10s, or 1h',
  })
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message:
      'JWT_REFRESH_EXPIRES_IN must be a string like 15m, 7d, 10s, or 1h',
  })
  JWT_REFRESH_EXPIRES_IN: string;

  // RabbitMQ
  @IsString()
  @IsNotEmpty()
  RABBITMQ_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  RABBITMQ_PORT: number;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_USER: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_PASS: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_URL: string;

  @IsString()
  @IsNotEmpty()
  QUEUE_NAME: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_EXCHANGE: string;

  // Redis
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_USERNAME: string;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsNumber()
  @IsNotEmpty()
  REDIS_DATABASE: number;

  @IsString()
  @IsNotEmpty()
  REDIS_KEY_PREFIX: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessage = errors
      .map((message) => {
        const constraints = message.constraints;
        const firstKey = Object.keys(constraints || {})[0];
        return constraints?.[firstKey];
      })
      .filter(Boolean)
      .join('\n');

    const COLOR = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      fgRed: '\x1b[31m',
    };

    throw new Error(`${COLOR.fgRed}${COLOR.bright}${errorMessage}${COLOR.reset}`);
  }

  return validatedConfig;
}
