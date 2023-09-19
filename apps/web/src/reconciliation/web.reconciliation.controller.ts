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
} from '@nestjs/swagger';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';
import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';
import { ReconciliationService } from '@app/shared/reconciliation/reconciliation.service';
import { ReconciliationDto } from '@app/shared/reconciliation/reconciliation.dto';


@Controller('reconciliation')
@ApiTags('reconciliation')
@UseInterceptors(ClassSerializerInterceptor)
export class WebReconciliationController {
  constructor(
    private ReconciliationService: ReconciliationService,

  ) { }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get reconciliations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ReconciliationDto,
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
  async findAll(@Query() params: { id: string, operatorId: string, providerId: string, createdBy: string }): Promise<ReconciliationDto[]> {
    return await this.ReconciliationService.getReconciliation(params);
  }

  @Version('1.0')
  @Get('/search')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'search reconciliations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ReconciliationDto,
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
  ): Promise<ReconciliationDto[]> {
    return null
  }


  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'get proposal tracking id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ReconciliationDto,
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
  async findById(@Param('id') id: string): Promise<ReconciliationDto[]> {
    return await this.ReconciliationService.getReconciliation({ id: id });
  }


  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create operator proposal' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ReconciliationDto,
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
  async create(@Body() ReconciliationDto: ReconciliationDto): Promise<ReconciliationDto> {
    return await this.ReconciliationService.create(ReconciliationDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update operatorProposal by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ReconciliationDto,
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
  async update(@Body() ReconciliationDto: ReconciliationDto): Promise<ReconciliationDto> {
    return null
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
    return await this.ReconciliationService.delete(id);
  }

}
