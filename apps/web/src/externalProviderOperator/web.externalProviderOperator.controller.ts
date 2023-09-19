import {
  Controller,
  UseFilters,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Version,
  HttpCode,
  HttpStatus,

  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,

} from '@nestjs/swagger';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { ExternalProviderOpeartorService } from '@app/shared/externalProviderOperator/externalProviderOperator.service';
import { externalProviderOpeartorDto } from '@app/shared/externalProviderOperator/externalProviderOperator.dto';

import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

@Controller('externalProviderOpeartor')
@ApiTags('externalProviderOpeartor')
@UseInterceptors(ClassSerializerInterceptor)
export class WebexternalProviderOpeartorsController {
  constructor(
    private externalProviderOpeartorService: ExternalProviderOpeartorService,
    private readonly customResponseService: CustomResponseService,
  ) { }

  @Version('1.0')
  @Get('/')
  @ApiOperation({ description: 'find all external provider or operator' })
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async findAll(@Query() params: { index: string, companyName: string, id: string }): Promise<externalProviderOpeartorDto[]> {
    return await this.externalProviderOpeartorService.findAll(params);
  }
  @Version('1.0')
  @Get('/top10')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async getTop10(@Query() params: { id: string, searchType: string }): Promise<externalProviderOpeartorDto[]> {
    return await this.externalProviderOpeartorService.getTop10(params);
  }

  @Version('1.0')
  @Get('/search')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async SearchByIdOrName(@Query() params: {
    authorId: string, offset: number, limit: number,
    idsToSkip: number[],
    searchQuery: string,
    searchType: string
  }): Promise<externalProviderOpeartorDto[]> {
    return await this.externalProviderOpeartorService.search(params);
  }

  @Version('1.0')
  @Get('/:id')
  @ApiOperation({ description: 'find by id ' })
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async findById(@Param('id') id: string): Promise<externalProviderOpeartorDto> {
    return await this.externalProviderOpeartorService.getExternalProviderOperatorById(id);
  }

  @Version('1.0')
  @Post('/single_item')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create single external provider or operator' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async createOne(@Body() externalProviderOpeartorDto: externalProviderOpeartorDto ,@Query("name") name:string): Promise<externalProviderOpeartorDto> {
    return await this.externalProviderOpeartorService.createOne(externalProviderOpeartorDto,null,name);
  }

  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create external provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async create(@Body() externalProviderOpeartorDto: externalProviderOpeartorDto[]): Promise<externalProviderOpeartorDto[]> {
    return await this.externalProviderOpeartorService.create(externalProviderOpeartorDto);

  }

  @Version('1.0')
  @Post('/createScrapper')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create external provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async createScrap(@Body() externalProviderOpeartorDto:externalProviderOpeartorDto[]): Promise<{successfulResults: externalProviderOpeartorDto[], errors: string[]}> {
    return await this.externalProviderOpeartorService.createScrapper(externalProviderOpeartorDto);

  }

  

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: externalProviderOpeartorDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async update(@Body() externalProviderOpeartorDto: externalProviderOpeartorDto): Promise<{ status: string, data?: externalProviderOpeartorDto, error?: string }> {
    return await this.externalProviderOpeartorService.update(externalProviderOpeartorDto);
  }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ description: 'delete provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: null,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async deleteProvider(@Param('id') id): Promise<string> {
    return await this.externalProviderOpeartorService.delete(id);
  }
}
