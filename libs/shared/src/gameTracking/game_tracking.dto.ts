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
import { GamesDto } from '../games/games.dto';
import { providerProposalDto } from '../providerProposal/providerProposal.dto';
import { ContractsDto } from '../contracts/contracts.dto';
import { ProvidersDto } from '../providers/providers.dto';

export class GameTrackingDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'game id' })
  gameId: GamesDto;

  @ApiProperty({ description: 'provider id' })
  providerId: ProvidersDto;

  @ApiProperty({ description: 'proposal id' })
  proposalId: string;


  @ApiProperty({ description: 'contract id' })
  contractId: ContractsDto;

  @IsString()
  @ApiProperty({ description: 'operator id' })
  operatorId: string;

  @IsString()
  @ApiProperty({ description: 'tracking status' })
  status: string;

  @IsString()
  @ApiProperty({ description: 'operator or provider' })
  index: string;

  @IsString()
  @ApiProperty({ description: 'refIndex for the operator id' })
  refIndex: string;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'createdBy' })
  createdBy: UsersDto;

  @IsDate()
  @ApiPropertyOptional({ description: 'createdDate' })
  createdDate: string;
  
  @IsDate()
  @ApiPropertyOptional({ description: 'modifiedDate' })
  modifiedDate: string;
}
