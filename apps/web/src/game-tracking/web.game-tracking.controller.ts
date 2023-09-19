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
  Headers,
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
import { GameTrackingDto } from '@app/shared/gameTracking/game_tracking.dto';
import { GameTrackingService } from '@app/shared/gameTracking/game_tracking.service';
import { ConfigService } from '@app/shared/core/config/config.service';
import { UsersService } from '@app/shared/users/users.service';


@Controller('gameTracking')
@ApiTags('gameTracking')
@UseInterceptors(ClassSerializerInterceptor)
export class WebGameTrackingController {
  constructor(
    private GameTrackingService: GameTrackingService,
    private readonly customResponseService: CustomResponseService,
    private readonly configService :ConfigService,
    private readonly usersService :UsersService

  ) { }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get proposal-tracking by details like id index and createdBy.pass all thing in a param' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GameTrackingDto,
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
  async findAll(@Query() params: { id: string, index: string, providerId: string, operatorId: string, proposalId: string, contractId: string, gameId: string, createdBy: string }): Promise<{ status: string, data?: GameTrackingDto[], error?: string }> {
    return await this.GameTrackingService.getGameTrackingByDetails(params);
  }

  @Version('1.0')
  @Get('/search/data')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'search any game tracking data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GameTrackingDto,
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
  async findSearch(
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<GameTrackingDto[]> {
    return await this.GameTrackingService.searchDetails(params);
  }


  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get proposal tracking id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GameTrackingDto,
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
  async findById(@Param('id') id: string): Promise<GameTrackingDto> {
    return await this.GameTrackingService.getGameTrackingById(id);
  }


  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create operator proposal' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GameTrackingDto,
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
  async create(@Body() GameTrackingDto: GameTrackingDto): Promise<GameTrackingDto> {
    return await this.GameTrackingService.create(GameTrackingDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update operatorProposal by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GameTrackingDto,
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
  async update(@Body() GameTrackingDto: GameTrackingDto,@Headers('authorization') token: string): Promise<{ status: string, data?: GameTrackingDto, error?: string }> {
    const decodeToken = await this.configService.decodeToken(token)
    const user = await this.usersService.getUserById(decodeToken.id)
    let companyDetails = user.companyID && JSON.parse(user.companyID) || {}
    return await this.GameTrackingService.update(GameTrackingDto,companyDetails);
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
    return await this.GameTrackingService.delete(id);
    return null
  }

}
