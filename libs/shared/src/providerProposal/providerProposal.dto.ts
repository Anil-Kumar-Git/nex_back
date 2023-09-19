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
import { createByUser } from '../common/apiDtos';
import { revShareBasedField } from '../contracts/contracts.entity';

export class providerProposalDto {
  @IsUUID()
  // @ApiProperty({example:"12345" ,description: 'id' })
  id!: string;

  @IsString()
  @ApiProperty({ example:"test_apiProposal" , description: 'proposal name' })
  proposalName!: string;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({type:createByUser  , description: 'created by' })
  createdBy!: UsersDto;

  @Type(() => ProvidersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new ProvidersDto(), value) : null,
  )
  @ApiPropertyOptional({type:createByUser , description: 'provider ID' })
  providerId!: ProvidersDto;
  
  @IsNumber()
  @ApiPropertyOptional({example:"12" , description: 'Number of existing games in catalog' })
  NumberOfExistingGamesInCatalog!:number

  @IsNumber()
  @ApiPropertyOptional({ example:"1" , description: 'Number of new games per year (approx)' })
  NumberOfNewGamesPerYear!:number

  @IsArray()
  @ApiPropertyOptional({example:["CD","FE"] ,type:Array, description: 'Local Licenses available' })
  localLicenses!: string[];

  @IsArray()
  @ApiPropertyOptional({example:["CD","FE"] ,type:Array, description: 'restricted countries' })
  restrictedCountries!: string[];

  @IsArray()
  @ApiPropertyOptional({example:["CD","FE"] ,type:Array, description: 'Included Countries' })
  includedCountries!: string[];

  @IsNumber()
  @ApiPropertyOptional({example:"2", description: 'RevShare to Provider' })
  revShareProvider: number;

  @IsString()
  @ApiPropertyOptional({example:revShareBasedField.GGR, description: 'RevShare based on GGR (Bet-Win) or NGR (Bet-Win-Bonus-Taxes)' })
  revShareBased: string;


  @IsNumber()
  @ApiPropertyOptional({example:"INR" , description: 'currency' })
  currency!: string;

   //RevShare to Provider in %
   @IsArray()
   @ApiProperty({ example: [100 - 200, 2001 - 2002], type: Array })
   revShareProviderTiers: string[];

  @IsBoolean()
  @ApiPropertyOptional({example:false , description: 'Accept Revshare tied to Revenue tiers? ' })
  revshareRevenueTiers : boolean;

 

  @IsString()
  // @ApiPropertyOptional({ example: 'Revshare tied to Game Type ' })
  @ApiProperty({example:false ,type:Boolean})
  revShareTiedToGameType: boolean;

  @IsArray()
  // @ApiPropertyOptional({example:["12345"] ,type:Array, example: 'Revshare tied to Game Type ' })
  @ApiProperty({example:["casino"] ,type:Array})
  gameType: string[];

  @IsNumber()
  @ApiPropertyOptional({example:123 ,type:Number, description: 'Branded Game surcharge in %' })
  brandedGameSurchargeIn!: number;

  @IsNumber()
  @ApiPropertyOptional({example:123 ,type:Number, description: 'Minimum Absolute Revshare Fee to be Generated/ Month' })
  minimumAbsoluteRevshareFee: number;

  @IsNumber()
  @ApiPropertyOptional({example:123 ,type:Number, description: 'Grace Period for Minimum Absolute Revshare Fee' })
  gracePeriodforMinimumAbsoluteRevshareFee: number;

  @IsNumber()
  @ApiPropertyOptional({example:123 ,type:Number, description: 'Setup cost' })
  setUpCost: number;

  @IsBoolean()
  @ApiPropertyOptional({example:false ,type:Boolean, description: 'Bonuses and Promotions included?' })
  bonusesAndPromotionsIncluded: boolean;
  
  @IsBoolean()
  // @ApiPropertyOptional({example:false ,type:Boolean, description: 'default the proposal' })
  default: boolean;

}
