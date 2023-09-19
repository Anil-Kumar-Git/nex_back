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

import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';
import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';
import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { UsersService } from '@app/shared/users/users.service';
import { UsersDto } from '@app/shared/users/users.dto';
import { Users } from '@app/shared/users/users.entity';

import { BasicAuthUser } from '@app/shared/basicauth/basic.auth.decorator';

@Controller('users')
@ApiTags('users')
export class TestUsersController {
  constructor(
    protected usersService: UsersService,
    protected readonly customResponseService: CustomResponseService,
  ) {}

  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: UsersDto,
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
  async create(
    @BasicAuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto,
  ): Promise<UsersDto> {
    return await this.usersService.create(authUser, userDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'update user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: UsersDto,
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
  async update(
    @BasicAuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto,
  ): Promise<UsersDto> {
    return await this.usersService.update(authUser, userDto);
  }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ description: 'delete user' })
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
  async deleteUser(
    @BasicAuthUser() authUser: UsersDto,
    @Param('id') id,
  ): Promise<string> {
    return await this.usersService.delete(authUser, id);
  }

  @ApiExcludeEndpoint()
  @Get('/tests/clear')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  async clear(@BasicAuthUser() authUser: UsersDto): Promise<string> {
    return await this.usersService.clear(authUser);
  }
}
