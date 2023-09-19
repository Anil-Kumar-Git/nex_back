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
  IsDate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UsersDto } from '../users/users.dto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { createByUser, proposalReceverId } from '../common/apiDtos';

export class ProposalTrackingDto {
  @IsUUID()
  // @ApiProperty({ description: 'id' ,example:"1234" })
  id!: string;

  @IsString()
  @ApiProperty({ description: 'proposal id' ,example:"232434324" })
  proposalId!: string;

  @IsString()
  @ApiProperty({ description: 'senderId id' ,example:"3234232432" })
  senderId!: string;

  @IsString()
  @ApiProperty({ description: 'receiverId id' ,type:[proposalReceverId] })
  receiverId!: string;

  @IsString()
  // @ApiProperty({ description: 'status of the tracking' ,example:"1234" })
  status!: string;

  @IsString()
  // @ApiProperty({ description: 'reject Reason' ,example:"1234" })
  rejectReason: string


  @IsString()
  @ApiProperty({ description: 'index' ,example:"Provider",type:"enum", })
  index!: string; //who are responsible for creating this items provider operator

  @IsString()
  // @ApiProperty({ description: 'refIndex' ,example:"1234" })
  refIndex!: string; //operator id should be Internal or Scraper

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'createdBy' ,type:createByUser })
  createdBy!: UsersDto;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @IsDate()
  // @ApiPropertyOptional({ description: 'modifiedDate' ,example:"1234" })
  modifiedDate: string;

  @ApiPropertyOptional({ name:"gameId" ,description: 'Enter your gameId' ,example:"1234" })
  gameId:string
}
