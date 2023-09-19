import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { UsersDto } from './../users/users.dto';
import { createByUser } from '../common/apiDtos';
import { servicePlan } from './operators.entity';

let plandetailExp={"startDate":"2023-07-20T07:08:18.822Z","endDate":"2023-07-22T09:11:26.430Z","planPrice":"orderData?.planPrice","currency":"EUR","duration":""}

export class OperatorsDto {
  @IsUUID()
  // @ApiProperty({ description: 'id',example:"1234"  })
  id!: string;

  @IsBoolean()
  @ApiProperty({ description: 'used nexus' ,example:false  })
  usednexus!: boolean;

  @IsString()
  @ApiProperty({ description: 'company name' ,example:"test_Company"  })
  companyName!: string;

  @IsEmail()
  @ApiProperty({ description: 'company email' ,example:"test_Company@yopmail.com"  })
  companyEmail: string;


  @IsNumber()
  @ApiProperty({ description: "currentQuarterRank" ,example:1 })
  currentQuarterRank: number;

  @IsNumber()
  @ApiProperty({ description: "LastQuarterRank" ,example:1  })
  lastQuarterRank: number;

  @IsString()
  @ApiProperty({ description: "company Website" ,example:"test.web"  })
  website: string;

  @IsString()
  @ApiPropertyOptional({ description: 'oldId' ,example:"12abc"  })
  oldId: string;

  @IsString()
  @ApiPropertyOptional({ description: 'ip range' ,example:"1"  })
  ipRange: string;

  @IsString()
  @ApiPropertyOptional({ description: 'vat Id' ,example:"12sd"  })
  vatId: string;

  @IsString()
  @ApiProperty({ description: 'tax Id' ,example:"we12"  })
  taxId!: string;

  @IsString()
  @ApiProperty({ description: 'Company Registration Number' ,example:"123"  })
  registrationNumber!: string;

  @IsString()
  @ApiPropertyOptional({ description: 'address' ,example:"tests"  })
  address: string;

  @IsString()
  @ApiPropertyOptional({ description: 'city' ,example:"Delhi"  })
  city: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'state' ,example:"Freemium"  })
  state: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'zip' ,example:"Freemium"  })
  zip: string;

  @IsString()
  @ApiPropertyOptional({ description: 'memberId' ,example:"121313"  })
  memberId!: string;

  @IsString()
  @ApiPropertyOptional({ description: 'memberId' ,example:"ACTIVE"  })
  planStatus!: string;

  @IsEnum(servicePlan)
  @ApiPropertyOptional({ description: 'servicePlan',type:"enum" ,example:servicePlan.Freemium ,enum:servicePlan})
  servicePlan!: servicePlan;


  @IsString()
  @ApiPropertyOptional({ description: 'planDetails' ,example:plandetailExp})
  planDetails: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'logo' ,example:"Freemium"  })
  logo: string;

  @Type(() => UsersDto)
  @ValidateNested()
  @Transform(({ value }) =>
    value ? Object.assign(new UsersDto(), value) : null,
  )
  @ApiPropertyOptional({ description: 'createdBy' ,type:createByUser})
  createdBy!: UsersDto;


  @IsString()
  // @ApiPropertyOptional({ description: 'createdDate' ,example:"Freemium"  })
  createdDate: string;

  @IsBoolean()
  @ApiPropertyOptional({ description: 'Accepted torm and condition or not' ,example:false })
  isAcceptedTerm: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'if false the not get any email from nexus' ,example:true  })
  emailSubscription!: boolean;

}
