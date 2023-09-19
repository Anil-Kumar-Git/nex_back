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
import { OperatorsDto } from '../operators/operators.dto';
import { createByUser } from '../common/apiDtos';

export class OperatorProposalDto {
  @IsUUID()
  @ApiProperty({ description: 'id' ,example:"1234"})
  id!: string;

  @IsString()
  @ApiProperty({ description: 'proposal name' ,example:"test_proposal"})
  proposalName!: string;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'createdBy' ,type:createByUser})
  createdBy!: UsersDto;

  @Type(() => OperatorsDto)
  @ValidateNested()
  @Transform(({ value}) =>
    value ? Object.assign(new OperatorsDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'operator ID' ,type:createByUser})
  operatorId!: OperatorsDto;

  @IsArray()
  @ApiPropertyOptional({ description: 'Local Licenses available' ,example:["CD","FR"], type: Array})
  localLicenses!: string[];

  @IsArray()
  @ApiPropertyOptional({ description: 'restricted countries' ,example:["CD","FR"], type: Array})
  restrictedCountries!: string[];

  @IsNumber()
  @ApiPropertyOptional({ description: 'RevShare to Provider' ,example:4})
  revShareProvider: number;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Accept Revshare tied to Revenue tiers? ' ,example:true})
  revshareRevenueTiers !: boolean;

  @IsArray()
  @ApiProperty({ example: [100 - 200, 2001 - 2002], type: Array })
  revShareProviderTiers: string[];


  @IsNumber()
  @ApiPropertyOptional({ description: 'Number of games offered (approx.)' ,example:4})
  numberOfGamesOffered!: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Number of monthly active users (approx)' ,example:4})
  numberOfMonthlyActiveUsers!: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Alexa rank in strongest country' ,example:4})
  alexaRankInStrongestCountry: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'Number of brands' ,example:4})
  numberOfBrands: number;

  @IsBoolean()
  // @ApiPropertyOptional({ description: 'default the proposal' ,example:false})
  default: boolean;

  @IsString()
  // @ApiPropertyOptional({ description: 'createdDate' ,example:"1234"})
  createdDate: string;
}
