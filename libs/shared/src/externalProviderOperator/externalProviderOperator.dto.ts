import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class externalProviderOpeartorDto {
  @IsUUID()
  // @ApiProperty({ description: "id" ,example:"1234"})
  id!: string;

  @IsString()
  @ApiProperty({ description: "company name" ,example:"test_Compnay"})
  companyName!: string;

  @IsString()
  @ApiProperty({ description: "company email" ,example:"test@yopmail.com"})
  companyEmail: string;

  @IsNumber()
  @ApiProperty({ description: "currentQuarterRank" ,example:12})
  currentQuarterRank: number;

  @IsNumber()
  @ApiProperty({ description: "LastQuarterRank" ,example:11})
  lastQuarterRank: number;

  @IsString()
  @ApiProperty({ description: "company Website" ,example:"https://www.nexus7995.com/api-faq"})
  website: string;

  @IsString()
  @ApiProperty({ description: "company old ID" ,example:"1234"})
  oldId: string;

  @IsString()
  @ApiPropertyOptional({ description: "ip range", example: "1", type: String})
  ipRange: string;

  @IsString()
  @ApiPropertyOptional({
    description: "vat Id",
    example: "asw621212",
    type: String})
  vatId: string;

  @IsString()
  @ApiProperty({ description: "tax Id", example: "ewweo32324", type: String })
  taxId!: string;

  @IsString()
  @ApiProperty({
    description: "Company Registration Number",
    example: "198743287739234",
    type: String})
  registrationNumber!: string;

  @IsString()
  @ApiPropertyOptional({
    description: "address",
    example: "russiana",
    type: String})
  address: string;

  @IsString()
  @ApiPropertyOptional({ description: "city" ,example:"delta"})
  city: string;

  @IsString()
  @ApiPropertyOptional({ description: "logo" ,example:"https://i.ibb.co/4YsvZNY/nexus-dark-logo.png"})
  logo: string;

  @IsString()
  @ApiPropertyOptional({ description: "state" ,example:"harya"})
  state: string;

  @IsString()
  @ApiPropertyOptional({ description: "zip" ,example:"zip"})
  zip: string;

  @IsString()
  @ApiProperty({
    description: "index(who is the responsible for create this item)"
  ,example:"Provider"})
  index!: string;

  @IsBoolean()
  @ApiProperty({ description: 'if false the not get any email from nexus' ,example:true  })
  emailSubscription!: boolean;
}
