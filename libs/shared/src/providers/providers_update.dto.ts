import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { UsersDto } from './../users/users.dto';

export class ProvidersUpdateDto {
  @IsUUID()
  @ApiProperty({ description: 'id' ,example:"1234" ,type:String})
  id!: string;

  @IsString()
  @ApiProperty({ description: 'company name'  ,example:"test_Company",type:String })
  companyName!: string;

  @IsEmail()
  @ApiProperty({ description: 'company email' ,example:"deo@yopmail.com" ,type:String })
  companyEmail: string;

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
  // @ApiPropertyOptional({ description: 'memberId' })
  memberId!: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'memberId' })
  planStatus!: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'servicePlan' ,example:"Freemium" ,type:String  })
  servicePlan!: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'planDetails' ,example:"Freemium" })
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

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
//   @ApiPropertyOptional({ description: 'createdBy user Id'  ,example:{
//     id:"f91681b3-1d47-43ae-a7c6-847cf378ad8a"
//   } ,type:UsersDto })
  createdBy!: UsersDto;

  @IsBoolean()
  @ApiProperty({ description: 'if false the not get any email from nexus' ,example:true  })
  emailSubscription!: boolean;
}
