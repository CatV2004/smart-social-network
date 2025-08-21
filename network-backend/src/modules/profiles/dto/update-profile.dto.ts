import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';
import { Gender } from '../entities/profile.entity';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
    @ApiPropertyOptional({ description: 'Biography of the profile owner' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ description: 'Location of the profile owner' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ description: 'Date of birth', type: String, format: 'date' })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: Date;

    @ApiPropertyOptional({ description: 'Gender of the profile owner', enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ description: 'Phone number' })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({ description: 'Personal website URL' })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiPropertyOptional({ description: 'Facebook profile URL' })
    @IsOptional()
    @IsUrl()
    facebook?: string;

    @ApiPropertyOptional({ description: 'LinkedIn profile URL' })
    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @ApiPropertyOptional({ description: 'GitHub profile URL' })
    @IsOptional()
    @IsUrl()
    github?: string;

    @ApiPropertyOptional({ description: 'Whether the profile is private' })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true) 
    isPrivate?: boolean;
}
