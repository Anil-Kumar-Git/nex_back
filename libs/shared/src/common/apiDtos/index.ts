
import { revShareBasedField } from '@app/shared/providerProposal/providerProposal.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
 
} from 'class-validator';
import { Role, userFrom, userType } from '../interfaces/errorResponse.interface';
import { UsersDto } from '@app/shared/users/users.dto';

export enum userStatus {
  ACTIVE = 'Active',
  DEACTIVE = 'Deactive',
}

export enum GameTrackStatus{
  Transmitted= "Transmitted" ,
  Accepted="Accepted",
  Queued= "Queued" ,
  Live="Live",
  Rejected= "Rejected",
  Disabled= "Disabled" ,
  ReEnabled=  "Re-Enabled" ,
  Deleted="Deleted" ,
  Deprecated= "Deprecated" 
};

export class createByUser {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
}

export class proposalReceverId {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  @ApiProperty({ example: 'companyEmail@yopmail.com',type:String  })
  companyEmail: string;
  @ApiProperty({ example: 'companyName',type:String  })
  companyName: string;
  @ApiProperty({ enum: userFrom, example: userFrom.INTERNAL, type: "enum"  })
  index: string;
}

export class UserApiProviderOperatorCreateDto {
  @ApiPropertyOptional({description: 'created by' })
  userId!: createByUser;
  @ApiPropertyOptional({example:'123214242', description: 'compnay id (provider/operator id) '})
  companyId: string;
  @ApiPropertyOptional({default:userStatus.ACTIVE , example:"Active", description: 'user Status'})
  status: userStatus;
}

export class UserApiProviderOperatorUpdateDto {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  @ApiProperty({example:"Active", description: 'user Status'})
  status: userStatus;
}

export class ApiGameTrackingUpdateDto {
  @ApiProperty({ example: '1234',type:String  })
  id: string;
  @ApiProperty({ enum: GameTrackStatus, example: GameTrackStatus.Transmitted, type: "enum" ,description: 'game tracking Status' })
  status: GameTrackStatus.Transmitted;
}

export class apiOperatorEditProposalDto {

  @ApiProperty({ description: 'id' ,example:"1234"})
  id!: string;
  @ApiProperty({ description: 'proposal name' ,example:"test_proposal"})
  proposalName!: string;
  @ApiPropertyOptional({ description: 'Local Licenses available' ,example:["CD","FR"], type: Array})
  localLicenses!: string[];
  @ApiPropertyOptional({ description: 'restricted countries' ,example:["CD","FR"], type: Array})
  restrictedCountries!: string[];
  @ApiPropertyOptional({ description: 'RevShare to Provider' ,example:4})
  revShareProvider: number;
  @ApiPropertyOptional({ description: 'Accept Revshare tied to Revenue tiers? ' ,example:true})
  revshareRevenueTiers !: boolean;
  @ApiProperty({ example: [100 - 200, 2001 - 2002], type: Array })
  revShareProviderTiers: string[];
  @ApiPropertyOptional({ description: 'Number of games offered (approx.)' ,example:4})
  numberOfGamesOffered!: number;
  @ApiPropertyOptional({ description: 'Number of monthly active users (approx)' ,example:4})
  numberOfMonthlyActiveUsers!: number;
  @ApiPropertyOptional({ description: 'Alexa rank in strongest country' ,example:4})
  alexaRankInStrongestCountry: number;
  @ApiPropertyOptional({ description: 'Number of brands' ,example:4})
  numberOfBrands: number;
}

export class apiUpdateContractsDto {
  @ApiProperty({ example: '0807f0f2-6d3a-4888-a39e-3ba071a28c0a', type: String })
  id: string;
  @ApiProperty({ example: 'test_contract', type: String })
  contractName!: string;
  @ApiProperty({ example: '2023-05-22T00:00:00Z', type: Date })
  startDate!: Date;
  @ApiProperty({ example: '3', type: Number })
  duration: number;
  @ApiProperty({ example: '2', type: Number })
  termPeriod: number;
  @ApiProperty({ example: '2', type: Number })
  autoRenewPerTerm: number;
  @ApiProperty({ example: '1', type: Number })
  gracePerMin: number;
  @ApiProperty({ example: '2', type: Number })
  minRevshareGen: number;
  @ApiProperty({ example: '53', type: Number })
  setUpCost: number;
  @ApiProperty({ example: false, type: Boolean })
  bonusPromotions: boolean;
  @ApiProperty({ example: false, type: Boolean })
  allGamesInclude: boolean;
  @ApiProperty({ example: '5', type: Number })
  bonusCap: number;
  @ApiProperty({ example: ["SYR", "FJI"], type: Array })
  gameExceptions: string[];
  @ApiProperty({ example: ["URY"], type: Array })
  includedCountries!: string[];
  @ApiProperty({ example: ["SOM"], type: Array })
  restrictedCountries!: string[];
  @ApiProperty({ example: ["GGY", "FJI"], type: Array })
  localLicenses!: string[];
  @ApiProperty({ example: false, type: Boolean })
  revshareRevenueTiers: boolean;
  @ApiProperty({ example: '53', type: Number })
  revShareProvider: number;
  @ApiProperty({ example: [
    { "min": 0, "max": 1000, "revShare": "10" },
    { "min": 1001, "max": 5000, "revShare": "12.5" }
  ], type: Array })
  revShareProviderTiers: string[];
  @ApiProperty({ example: "GBP", type: String })
  currency: string;
  @ApiPropertyOptional({
    type: "enum",
    enum: revShareBasedField,
    example: revShareBasedField.GGR,
  })
  revShareBased: revShareBasedField;
  @ApiProperty({ example: false, type: Boolean })
  revShareTiedToGameType: boolean;
  @ApiProperty({ example: ['casino'], type: String })
  gameType: string;
  @ApiProperty({ example: '5', type: Number })
  brandedGameSurchargeIn: number;
  @ApiProperty({ example: false, type: Boolean })
  negativeCarryOverAllowed: boolean;
  @ApiProperty({ example: "https://multer-check-prod-nes-image-dlfuiy.mo1.mogenius.io/uploads/Reconciliationfile (6).pdf", type: String })
  physicalContract: string;
  @ApiProperty({ enum: Role, example: Role.PROVIDER, type: Role })
  index: string;
  @ApiProperty({ example: 'Scraper', type: String })
  refIndex: string;
}

export class apiUpdateUsersDto {
  @ApiProperty({ example: '1234', type: String })
  id!: string;
  @ApiProperty({ example: 'john', type: String })
  firstname!: string;
  @ApiProperty({ example: 'doe', type: String })
  lastname!: string;
  @ApiProperty({ example: '9870678', type: String })
  mobile!: string;
  @ApiPropertyOptional({ description: 'whatsapp',example: '9870678' })
  whatsapp: string;
  @ApiPropertyOptional({ description: 'skype' ,example: 'akg_tamur' })
  skype: string;
  @ApiPropertyOptional({ description: 'slack' ,example: 'akg_123' })
  slack: string;
  @ApiPropertyOptional({ description: 'telegram' ,example: '9870678' })
  telegram: string;
  @ApiPropertyOptional({ description: 'signal' ,example: '9870678' })
  signal: string;
  @ApiPropertyOptional({ description: 'viber' ,example: '9870678' })
  viber: string;
  @ApiPropertyOptional({ description: 'discord' ,example: '9870678' })
  discord: string;
  @ApiPropertyOptional({description: 'userType' ,  type: "enum", enum: userType,
  default: userType.TECHNICAL_UER,})
  userType: string;
}



