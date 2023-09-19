import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  MinLength,
  IsUUID,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { OperatorsDto } from './../operators/operators.dto';
import { ProvidersDto } from './../providers/providers.dto';
import { UsersDto } from '../users/users.dto';
import { revShareBasedField } from './contracts.entity';
import { type } from 'os';
import { Role } from '../common/interfaces/errorResponse.interface';
import { Index } from 'typeorm';
import { createByUser } from '../common/apiDtos';

export class ContractsDto {
  @IsUUID()
  // @ApiProperty({ example: '0807f0f2-6d3a-4888-a39e-3ba071a28c0a', type: String })
  id: string;

  @IsString()
  // @ApiProperty({ example: 'Enter contract name' })
  @ApiProperty({ example: 'test_contract', type: String })
  contractName!: string;

  @IsNumber()
  // @ApiProperty({ type:Number, example: 'Enter contract version like:(2.0)' })
  contractVersion: number;

  @IsDate()
  @ApiProperty({ example: '2023-05-22T00:00:00Z', type: Date })
  startDate!: Date;

  @IsNumber()
  // @ApiPropertyOptional({ example: 'duration' })
  @ApiProperty({ example: '3', type: Number })
  duration: number;

  @IsNumber()
  // @ApiPropertyOptional({ example: 'termination period' })
  @ApiProperty({ example: '2', type: Number })
  termPeriod: number;

  @IsNumber()
  // @ApiPropertyOptional({ example: 'Auto Renewal Period if not Terminated' })
  @ApiProperty({ example: '2', type: Number })
  autoRenewPerTerm: number;

  @IsNumber()
  // @ApiPropertyOptional({
  //   example: 'Grace Period for Minimum Absolute Revshare Fee',
  // })
  @ApiProperty({ example: '1', type: Number })
  gracePerMin: number;

  @IsNumber()
  // @ApiPropertyOptional({
  //   example: 'Minimum Absolute Revshare Fee to be Generated/Month',
  // })
  @ApiProperty({ example: '2', type: Number })
  minRevshareGen: number;

  @IsNumber()
  // @ApiPropertyOptional({ example: 'setup cost' })
  @ApiProperty({ example: '53', type: Number })
  setUpCost: number;

  @IsBoolean()
  // @ApiPropertyOptional({ example: 'Bonuses and Promotions included?' })
  @ApiProperty({ example: false, type: Boolean })
  bonusPromotions: boolean;

  @IsBoolean()
  // @ApiPropertyOptional({ example: 'All game include?' })
  @ApiProperty({ example: false, type: Boolean })
  allGamesInclude: boolean;


  @IsNumber()
  // @ApiPropertyOptional({
  //   example:
  //     'Bonus Cap: Up to which % can the bonus be allocated to Provider?',
  // })
  @ApiProperty({ example: '5', type: Number })
  bonusCap: number;

  @IsArray()
  // @ApiPropertyOptional({ example: 'List of Game include in this contract' })
  @ApiProperty({ example: ["SYR", "FJI"], type: Array })
  gameExceptions: string[];

  @IsArray()
  // @ApiPropertyOptional({ example: 'included countries' })
  @ApiProperty({ example: ["URY"], type: Array })
  includedCountries!: string[];

  @IsArray()
  // @ApiPropertyOptional({ example: 'restricted countries' })
  @ApiProperty({ example: ["SOM"], type: Array })
  restrictedCountries!: string[];
  @IsArray()
  // @ApiPropertyOptional({ example: 'Local Licenses available' })
  @ApiProperty({ example: ["GGY", "FJI"], type: Array })
  localLicenses!: string[];

  @IsBoolean()
  // @ApiPropertyOptional({ example: 'Revshare tied to Revenue Tiers?' })
  @ApiProperty({ example: false, type: Boolean })
  revshareRevenueTiers: boolean;

  //RevShare to Provider in %
  @IsNumber()
  @ApiProperty({ example: '53', type: Number })
  revShareProvider: number;

  //RevShare to Provider in %
  @IsArray()
  @ApiProperty({ example: [
    { "min": 0, "max": 1000, "revShare": "10" },
    { "min": 1001, "max": 5000, "revShare": "12.5" }
  ], type: Array })
  revShareProviderTiers: string[];

  @IsString()
  // @ApiPropertyOptional({ example: 'currency' })
  @ApiProperty({ example: "GBP", type: String })
  currency: string;

  @IsString()
  @ApiPropertyOptional({
    type: "enum",
    enum: revShareBasedField,
    example: revShareBasedField.GGR,
    // example: 'RevShare based on GGR (Bet-Win) or NGR (Bet-Win-Bonus-Taxes)'
  })
  revShareBased: revShareBasedField;

  @IsString()
  // @ApiPropertyOptional({ example: 'Revshare tied to Game Type ' })
  @ApiProperty({ example: false, type: Boolean })
  revShareTiedToGameType: boolean;

  @IsArray()
  // @ApiPropertyOptional({ example: 'Revshare tied to Game Type ' })
  @ApiProperty({ example: ['casino'], type: String })
  gameType: string;

  @IsNumber()
  // @ApiPropertyOptional({ example: 'Branded Game surcharge in %' })
  @ApiProperty({ example: '5', type: Number })
  brandedGameSurchargeIn: number;

  @IsBoolean()
  // @ApiPropertyOptional({ example: 'Negative carry over allowed' })
  @ApiProperty({ example: false, type: Boolean })
  negativeCarryOverAllowed: boolean;


  //Upload physical Contract
  @IsString()
  // @ApiPropertyOptional({ example: 'Upload physical Contract' })
  @ApiProperty({ example: "https://multer-check-prod-nes-image-dlfuiy.mo1.mogenius.io/uploads/Reconciliationfile (6).pdf", type: String })
  physicalContract: string;

  @IsString()
  // @ApiPropertyOptional({ example: 'operator id' })
  @ApiProperty({
    example:"c7bb0a40-f6d7-407c-a8cb-32061b3fe149", type: String
  })
  operatorId!: string // operator id


  @IsString()
  // @ApiPropertyOptional({ example: 'providerId id' })
  @ApiProperty({ example: "fce013d0-a9c1-4111-a220-d26d06cc0454", type: String })
  providerId!: string // providerId id

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  // @ApiPropertyOptional({ example: 'createdBy ' })
  @ApiProperty({ type: createByUser })
  createdBy!: UsersDto;

  @IsString()
  @Index('index')
  @ApiProperty({ enum: Role, example: Role.PROVIDER, type: Role })
  index: string;

  @IsString()
  @ApiProperty({ example: 'Scraper', type: String })
  refIndex: string;

  // @ApiProperty({ example: false, type: Boolean })
  @IsBoolean()
  default: boolean;

  @IsString()
  // @ApiProperty({ example: 'status of the contract' })
  status!: string;


}
