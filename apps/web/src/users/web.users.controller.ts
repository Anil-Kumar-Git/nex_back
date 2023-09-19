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
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
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

import { UsersService } from '@app/shared/users/users.service';
import { ChangePasswordDto, UsersDto } from '@app/shared/users/users.dto';
import { Users } from '@app/shared/users/users.entity';

import { JWTAuthGuard } from './../auth/jwt.auth.guard';
import { SessionAuthGuard } from './../auth/session.auth.guard';
import { AuthUser } from './../users/web.users.decorator';
import { UsersDeactivateService } from '@app/shared/users/deactvate.user.service';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class WebUsersController {
  constructor(
    protected usersService: UsersService,
    protected usersDeActivateService: UsersDeactivateService,
    protected readonly customResponseService: CustomResponseService,
  ) { }

  @Version('1.0')
  @Get('/:id')
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
  async getuserById(@Param('id') id: string): Promise<UsersDto> {
    return await this.usersService.getUserById(id);
  }

  @Version('1.0')
  @Get('/')
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
  async getAlluser(): Promise<UsersDto[]> {
    return await this.usersService.getAllUser();
  }

  @Version('1.0')
  @Post('/changePassword')
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
  async changePassword(
    @Body() userDto: ChangePasswordDto,
  ): Promise<{ status: string, data?: UsersDto, error?: string }> {
    return await this.usersService.changePassword(userDto);
  }

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
    @AuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto,
  ): Promise<UsersDto> {
    return await this.usersService.create(authUser, userDto);
  }
  @Version('1.0')
  @Post('/contactUs')
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
  async contactUs(@Body() bodyData:{senderEmail:string,message:string,firstName:string,lastName?:string,companyName:string,businessType:string}): Promise<{status:string,data?:string,error?:string}> {
    return await this.usersService.contactUs(bodyData);
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
    @AuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto,
  ): Promise<{ status: string, data?: UsersDto | any, error?: string }> {
 
    return await this.usersService.update(userDto,authUser);
  }

  @Version('1.0')
  @Delete('/deleteSubUser/:id')
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
  async deleteSubUser(@Param('id') id: string): Promise<{ status: string, data?: string, error?: string }> {
    return await this.usersService.deleteSubUser(id);
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
    @Param('id') id: string,
  ): Promise<{ status: string, data?: string, error?: string }> {
    return await this.usersService.delete(id);
  }

  @Version('1.0')
  @Delete('/deActivate/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  async deActivateUser(
    @Param('id') id: string,
  ) : Promise<{ status: string, data?: string, message?: string }>
   {
    return await this.usersDeActivateService.setDeactvateDate(id);
  }

}
