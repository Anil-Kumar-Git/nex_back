import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { UsersDto } from './../users/users.dto';
import { serviceProPlan } from './providers.entity';

let plandetailExp={"startDate":"2023-07-20","endDate":"2023-07-22","planPrice":"orderData?.planPrice","currency":"EUR","duration":""}

export enum planStatus {
  Active = "ACTIVE", Canceled = "CANCELED"
}
export class ProvidersDto {
  @IsUUID()
  // @ApiProperty({ description: 'id' ,example:"1234" ,type:String})
  id!: string;

  @IsString()
  @ApiProperty({ description: 'company name'  ,example:"test_Company",type:String })
  companyName!: string;

  @IsEmail()
  @ApiProperty({ description: 'company email' ,example:"deo@yopmail.com" ,type:String })
  companyEmail: string;

  @IsNumber()
  @ApiProperty({ description: "currentQuarterRank" })
  currentQuarterRank: number;

  @IsNumber()
  @ApiProperty({ description: "LastQuarterRank" })
  lastQuarterRank: number;

  @IsString()
  @ApiProperty({ description: "company Website" })
  website: string;

  @IsString()
  @ApiPropertyOptional({ description: 'ip range'  ,example:"1" ,type:String})
  ipRange: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'oldId' })
  oldId: string;

  
  @IsString()
  @ApiPropertyOptional({ description: 'vat Id' ,example:"asw621212"  ,type:String})
  vatId: string;

  @IsString()
  @ApiProperty({ description: 'tax Id'  ,example:"ewweo32324" ,type:String})
  taxId!: string;

  @IsString()
  @ApiProperty({ description: 'Company Registration Number' ,example:"198743287739234"  ,type:String})
  registrationNumber!: string;

  @IsString()
  @ApiPropertyOptional({ description: 'address' ,example:"russiana" ,type:String })
  address: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'city' })
  city: string;

  @IsString()
  @ApiPropertyOptional({ description: 'memberId' })
  memberId!: string;

  @IsString()
  @ApiPropertyOptional({ description: 'memberId',example:"ACTIVE", type: 'enum',
  nullable: false,
  enum: planStatus })
  planStatus!: string;

  @IsEnum(serviceProPlan)
  @ApiPropertyOptional({ description: 'servicePlan',type:"enum" ,example:serviceProPlan.Freemium ,enum:serviceProPlan  })
  servicePlan!: serviceProPlan;

  @IsString()
  @ApiPropertyOptional({ description: 'planDetails' ,example:plandetailExp })
  planDetails: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'logo' })
  logo: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'state' })
  state: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'zip' })
  zip: string;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Accepted torm and condition or not' })
   isAcceptedTerm : boolean;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'createdBy user Id'  ,example:{
    id:"f91681b3-1d47-43ae-a7c6-847cf378ad8a"
  } ,type:UsersDto })
  createdBy!: UsersDto;

  @IsBoolean()
  @ApiProperty({ description: 'if false the not get any email from nexus' ,example:true  })
  emailSubscription!: boolean;
}
