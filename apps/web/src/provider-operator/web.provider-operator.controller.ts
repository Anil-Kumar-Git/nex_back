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
  ApiQuery

} from '@nestjs/swagger';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';


import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';
import { query } from 'express';
import { ProviderOperatorService } from '@app/shared/provider-operator/provider-operator.service';
import { providerOperatorDto } from '@app/shared/provider-operator/provider-operator.dto';


@Controller('providerOperator')
@ApiTags('providerOperator')
@UseInterceptors(ClassSerializerInterceptor)
export class WebProviderOperatorController {
  constructor(
    private ProviderOperatorService: ProviderOperatorService,
    private readonly customResponseService: CustomResponseService,
  ) { }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get operator proposal by id ,providerID and createdBy' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: providerOperatorDto,
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
  async findAll(@Query() params: { providerId: string, operatorId: string, id: string, createdBy: string, index: string,status?:string }): Promise<providerOperatorDto[]> {
    return await this.ProviderOperatorService.find(params);
  }

  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create operator proposal' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: providerOperatorDto,
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
  async create(@Body() providerOperatorDto: providerOperatorDto): Promise<providerOperatorDto[]> {
      return await this.ProviderOperatorService.addOperatorById(providerOperatorDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update operatorProposal by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: providerOperatorDto,
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
  async update(@Body() providerOperatorDto: providerOperatorDto): Promise<{status:string,data?:providerOperatorDto,error?:string}> {
    return await this.ProviderOperatorService.update(providerOperatorDto);
  }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ description: 'delete operator proposal by id' })
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
    return await this.ProviderOperatorService.delete(id);
  }

  @Version('1.0')
  @Get('/search')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'search active operators' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: providerOperatorDto,
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
  async SearchByIdOrName(@Query() params:{
    limit: number,query:string,type:string, typeId:string,status:string
  }): Promise<string[] > {        
    return await this.ProviderOperatorService.search(params);}
}
