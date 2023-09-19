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
  Query,
  UploadedFile, UseInterceptors, Req, Headers
} from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

import {
  ApiTags,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiParam,
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { ContractsService } from "@app/shared/contracts/contracts.service";
import { ContractsDto } from "@app/shared/contracts/contracts.dto";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
import { ConfigService } from "@app/shared/core/config/config.service";
import { UsersService } from "@app/shared/users/users.service";

@Controller("contracts")
@ApiTags("contracts")
export class WebContractsController {
  constructor(
    private contractsService: ContractsService,
    private readonly customResponseService: CustomResponseService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService


  ) { }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File ,@Req() req: Request) {
  //   const imageURL =`${req.protocol}://${req.get('Host')}/${file.path}`
  //   return {url: imageURL}
  // }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "list of all contracts, if you are Provider then use providerId,if you are Operator then use operatorId , one is compulsory" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all contract successfully",
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async findAll(
    @Query()
    params: {
      providerId?: string;
      operatorId?: string;
      id: string;
      createdBy: string;
      status: string;
      index: string;

    }
  ): Promise<ContractsDto[]> {
    return await this.contractsService.findByDetails(params);
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Find a single contract" })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get contract successfully",
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async getContractById(@Param("id") id: string): Promise<ContractsDto> {
    return await this.contractsService.getContractById(id);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create contract" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ContractsDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async create(@Body() contractsDto: ContractsDto): Promise<ContractsDto[]> {
    return await this.contractsService.create(contractsDto);
  }

  @Version("1.0")
  @Get("/search/data")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "search the list of contracts" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ContractsDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async findSearch(
    @Query() params: { query?: string; typeId?: string; type: string, status: string; }
  ): Promise<ContractsDto[]> {
    return await this.contractsService.searchDetails(params);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update contract" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ContractsDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async update(@Body() contractDto: ContractsDto, @Headers('authorization') token: string
  ): Promise<{ status: string, data?: ContractsDto, error?: string }> {
    try {
      const decodeToken = await this.configService.decodeToken(token)
      const user = await this.usersService.getUserById(decodeToken.id)
      let companyDetails = user.companyID && JSON.parse(user.companyID) || {}
      return await this.contractsService.update(contractDto, companyDetails);
    } catch (error) {
      return error
    }
  }

  @Version("1.0")
  @Put("/changeStatus")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update contract" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ContractsDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async ChangeContractStatus(
    @Body() contractDto: ContractsDto
  ): Promise<{ status: String, data?: ContractsDto, error?: string }> {
    return await this.contractsService.ChangeContractStatus(contractDto);
  }


  @Version("1.0")
  @Put("/updateDefault")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update contract" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ContractsDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async UpdateDefault(
    @Body() contractDto: { id: string; providerId: string; default: boolean }
  ): Promise<ContractsDto> {
    return await this.contractsService.UpdateDefault(contractDto);
  }


  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id" })
  @ApiOperation({ description: "delete contract" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: null,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async deleteContract(@Param("id") id): Promise<string> {
    return await this.contractsService.delete(id);
  }
}
