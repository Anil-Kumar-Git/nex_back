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
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { ProvidersService } from '@app/shared/providers/providers.service';
import { ProvidersDto } from '@app/shared/providers/providers.dto';
import { Providers } from '@app/shared/providers/providers.entity';

import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

@Controller('providers')
@ApiTags('providers')
export class TestProvidersController {
  constructor(
    private providersService: ProvidersService,
    private readonly customResponseService: CustomResponseService,
  ) {}

  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProvidersDto,
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
  async create(@Body() providerDto: ProvidersDto): Promise<ProvidersDto> {
    return await this.providersService.create(providerDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProvidersDto,
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
  async update(@Body() providerDto: ProvidersDto): Promise<ProvidersDto> {
    return await this.providersService.update(providerDto);
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
    return await this.providersService.delete(id);
  }

  @ApiExcludeEndpoint()
  @Get('/tests/clear')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  async clear(): Promise<string> {
    return await this.providersService.clear();
  }
}
