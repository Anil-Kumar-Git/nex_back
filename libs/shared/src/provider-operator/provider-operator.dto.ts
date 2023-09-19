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
import { OperatorProposalDto } from '../operatorProposal/operatorProposal.dto';
import { OperatorsDto } from '../operators/operators.dto';
import { createByUser } from '../common/apiDtos';
import { Status } from './provider-operator.entity';

export class providerOperatorDto {
  @IsUUID()
  // @ApiProperty({ example:"1234" , description: 'id' })
  id!: string;

  @IsString()
  @ApiPropertyOptional({ example:{
    "Internal":["bf5d091b-1d7b-48b4-8d44-8001b15c689e"],
    "Scraper":[]
    } , description: 'operator id' })
  operatorId!: string // operator id


  @IsString()
  @ApiPropertyOptional({  example:"1234" , description: 'providerId id' })
  providerId!: string // providerId id


  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({type:createByUser , description: 'createdBy' })//who create the items
  createdBy!: UsersDto;

  //who is the responsible for creating the items

  @IsString()
  // @ApiPropertyOptional({example:"Provider" , description: 'index' })
  index!: string //who create the items :-provider operator

  @IsString()
  // @ApiPropertyOptional({example:"Scrapper" , description: 'refID' })
  refID!: string//which id they are use for the creating the this items(scraper internal )   

  @IsString()
  @ApiPropertyOptional({example:Status.Active, description: "provider operator status" })
  status: Status

}
