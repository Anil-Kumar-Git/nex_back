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
import { ProposalTrackingService } from '@app/shared/proposalTracking/proposal_tracking.service';
import { ProposalTrackingDto } from '@app/shared/proposalTracking/proposal_tracking.dto';


@Controller('proposalTracking')
@ApiTags('proposalTracking')
@UseInterceptors(ClassSerializerInterceptor)
export class WebProposalTrackingController {
  constructor(
    private proposalTrackingService: ProposalTrackingService,
    private readonly customResponseService: CustomResponseService,
  ) { }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get proposal-tracking by details like id index and createdBy.pass all thing in a param' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
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
  async findAll(@Query() params: { id: string, index: string, createdBy: string, senderId: string, receiverId: string,proposalId?:string }): Promise<{ status: string, data?: ProposalTrackingDto[], error?: string }> {
    return await this.proposalTrackingService.getProposalTrackingByDetails(params);
  }


  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get proposal tracking id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
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
  async findById(@Param('id') id: string): Promise<ProposalTrackingDto> {
    return await this.proposalTrackingService.getProposalTrackingById(id);
  }


  @Version('1.0')
  @Post('/providerProposal')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create provider proposal tracking' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
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
  async create(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string, data?: ProposalTrackingDto[], error?: string }> {
    return await this.proposalTrackingService.create(proposalTrackingDto);
  }


  @Version('1.0')
  @Post('/operatorProposal')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create operator proposal tracking' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
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
  async createOperatorProposalTracking(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string, data?: ProposalTrackingDto[], error?: string }> {
    return await this.proposalTrackingService.createOperatorProposalTracking(proposalTrackingDto);
  }


  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update operatorProposal by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
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
  async update(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string; data?: ProposalTrackingDto; error?: string }> {
    return await this.proposalTrackingService.update(proposalTrackingDto);
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
    return await this.proposalTrackingService.delete(id);
  }

}
