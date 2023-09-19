import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  ValidateNested,
} from 'class-validator';
 
 
export class GameThemesDto {
  @IsUUID()
  @ApiProperty({ description: 'id', example:"123" })
  id!: string;

  @IsString()
  @ApiProperty({ description: 'gameTheme name' , example:"todo" })
  gameTheme!: string;

  @IsString()
  // @ApiPropertyOptional({ description: 'createdDate', example:"123"  })
  createdDate: string;
}
