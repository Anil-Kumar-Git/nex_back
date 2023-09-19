import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsUUID,
    IsDate,
} from 'class-validator';
import { UsersDto } from '../users/users.dto';
import { createByUser } from '../common/apiDtos';
 
export class ReconciliationDto {
    @IsUUID()
    // @ApiProperty({ description: 'id' })
    id: string;

    @ApiProperty({ description: 'provider id',example:"1234" })
    providerId: string;


    @IsString()
    @ApiProperty({ description: 'operator id' ,example:"1234" })
    operatorId: string;


    @IsString()
    @ApiProperty({ description: 'who create this item (operator or provider)' ,example:"Provider" })
    index: string;

    @IsString()
    @ApiProperty({ description: 'refIndex for the provider or operator id' ,example:"Scrapper" })
    refIndex: string;

    @IsString()
    @ApiProperty({ description: 'reconciliationFile link' ,example:"https://multer-check-prod-nes-image-dlfuiy.mo1.mogenius.io/uploads/Tickets.pdf" })
    reconciliationFile: string;

    @IsString()
    @ApiPropertyOptional({ description: 'referenceDate' ,example:"2023-06-01T18:30:00.000Z" })
    referenceDate: string;

    @ApiPropertyOptional({ description: 'createdBy' ,type:createByUser })
    createdBy: UsersDto;

    @IsDate()
    // @ApiPropertyOptional({ description: 'createdDate' ,example:"1234" })
    createdDate: string;

    @IsDate()
    // @ApiPropertyOptional({ description: 'modifiedDate' ,example:"1234" })
    modifiedDate: string;
}
