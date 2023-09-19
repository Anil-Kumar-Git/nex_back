import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  IsArray,
  MinLength,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UsersDto } from '../users/users.dto';
import { ProvidersDto } from '../providers/providers.dto';

export class UserProviderOperatorDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id!: string;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'created by' })
  userId!: UsersDto;

  @IsString()
  @ApiPropertyOptional({ description: 'compnay id (provider/operator id) '})
  companyId: string;
  

  @IsString()
  @ApiPropertyOptional({ description: 'compnay id (provider/operator id) '})
  status: string;

}
