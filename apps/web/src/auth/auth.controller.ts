import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  UseFilters,
  Version,
  Headers,
  Put
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

import { ErrorResponse, updateEmailSubscription } from '@app/shared/common/interfaces/errorResponse.interface';
import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';
import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

import { AuthUser } from './../users/web.users.decorator';
import { UsersDto } from '@app/shared/users/users.dto';
import { AuthService } from './auth.service';
import { JWTAuthGuard } from './jwt.auth.guard';
import { LocalAuthGuard } from './local.auth.guard';
import { SessionAuthGuard } from './session.auth.guard';
import { TokenInterceptor } from './token.interceptor';
import { Public } from './public.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Version('1.0')
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    type: UsersDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async register(@Body() user: UsersDto): Promise<UsersDto> {
    return await this.authService.register(user);
  }

  @Version('1.0')
  @Put('/isNotAuth')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    type: UsersDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async authFree(@Body() details: updateEmailSubscription): Promise<UsersDto> {
    return await this.authService.authFree(details);
  }


  @Version('1.0')
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'login user' })
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
  async login(@AuthUser() user: UsersDto): Promise<UsersDto> {
    return user;
  }

  //forgot password

  @Version('1.0')
  @Post('forgot_password_link')
  @Public()
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'login user' })
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
  async forgotPasswordLink(@Body() userDto: UsersDto): Promise<{ status: string, data?: any, error?: string }> {
    try {
      const res = await this.authService.forgotPasswordLink(userDto)
      return res
    } catch (error) {
      return { status: "error", data: error }

    }
  }

  @Version('1.0')
  @Post('forgot_password')
  @Public()
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'login user' })
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
  async forgotPassword(@Body() usersDto: UsersDto): Promise<{ status: string, data?: any, error?: string }> {
    try {
      const res = await this.authService.forgotPassword(usersDto)
      return res
    } catch (error) {
      return { status: "error", error: error }

    }
  }

  @Version('1.0')
  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'me' })
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
  async me(@AuthUser() user: UsersDto): Promise<UsersDto> {
    return user;
  }

  @Version('1.0')
  @Post('/checkout')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(TokenInterceptor)
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    type: UsersDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async checkout(@Body() user: any): Promise<any> {
    return await this.authService.checkout(user);
  }

  @Version('1.0')
  @Post('/planCancle')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(TokenInterceptor)
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: 'create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    type: UsersDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async orderCancle(@Body() user: any): Promise<any> {
    let cancleType="cancle"
    return await this.authService.checkout(user,cancleType);
  }

}
