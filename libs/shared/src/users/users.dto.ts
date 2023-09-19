import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsUUID,
  ValidateNested,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Role } from '../common/interfaces/errorResponse.interface';
import { userType } from '../common/interfaces/errorResponse.interface';

export interface UsersDataDto {
  status: number,
  message: string,
  data?: UsersDto
}

export class UsersDto {
  @IsUUID()
  // @ApiProperty({ example: '1234', type: String })
  id!: string;

  @IsString()
  // @ApiProperty({ example: '1234', type: String })
  apiKey: string;

  @IsEmail()
  @ApiProperty({ example: 'john@gmail.com', type: String })
  email!: string;

  @IsString()
  @ApiProperty({ example: 'john', type: String })
  firstname!: string;

  @IsString()
  @ApiProperty({ example: 'doe', type: String })
  lastname!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  // @ApiProperty({ example: 'jhon@123', type: String })
  password!: string;

  @IsString()
  @ApiProperty({ example: '9870678', type: String })
  mobile!: string;

  @IsString()
  @ApiPropertyOptional({ description: 'whatsapp',example: '9870678' })
  whatsapp: string;

  @IsString()
  @ApiPropertyOptional({ description: 'skype' ,example: 'akg_tamur' })
  skype: string;

  @IsString()
  @ApiPropertyOptional({ description: 'slack' ,example: 'akg_123' })
  slack: string;

  @IsString()
  @ApiPropertyOptional({ description: 'telegram' ,example: '9870678' })
  telegram: string;

  @IsString()
  @ApiPropertyOptional({ description: 'signal' ,example: '9870678' })
  signal: string;

  @IsString()
  @ApiPropertyOptional({ description: 'viber' ,example: '9870678' })
  viber: string;

  @IsString()
  @ApiPropertyOptional({ description: 'discord' ,example: '9870678' })
  discord: string;

  @IsString()
  @ApiProperty({ type: "enum", enum: Role,
    default: Role.PROVIDER,
  })
  userRole!: string;

  @IsString()
  @ApiPropertyOptional({  type: "enum", enum: userType,
  default: userType.TECHNICAL_UER,})
  userType: string;

  @IsBoolean()
  // @ApiPropertyOptional({ description: 'first time user signup yes or not' })
  initialUser: boolean;

  @IsBoolean()
  // @ApiPropertyOptional({ description: 'there profile completed or not ' })
  profileCompleted: boolean;

  @IsDate()
  deactivationDate :Date

}

export interface UserWithCompnay extends UsersDto {
  companyID?: string;
}

export class ChangePasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'john@gmail.com', type: String })
  email!: string;

  @IsString()
  @ApiPropertyOptional({ example: 'password', type: String })
  password!: string;

  @IsString()
  @ApiPropertyOptional({ example: 'conformPassword', type: String })
  oldPassword!: string;
}