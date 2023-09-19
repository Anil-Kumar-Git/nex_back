import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
} from 'class-validator';
 
 
export class NotificationDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'senderId' })
  senderId: string;

  @IsString()
  @ApiProperty({ description: 'receiverId' })
  receiverId: string;

  @IsString()
  @ApiProperty({ description: 'title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'body' })
  body: string;

  @IsString()
  @ApiProperty({ description: 'type' })
  type: string;

  @IsString()
  @ApiProperty({ description: 'link' })
  link: string;

  @IsString()
  @ApiProperty({ description: 'link' })
  status: string;

  @IsString()
  @ApiPropertyOptional({ description: 'createdDate' })
  createdDate: string;

  @IsString()
  @ApiPropertyOptional({ description: 'modifiedDate' })
  modifiedDate: string;
}
