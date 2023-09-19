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
} from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { OperatorProposalService } from "@app/shared/operatorProposal/operatorProposal.service";
import { OperatorProposalDto } from "@app/shared/operatorProposal/operatorProposal.dto";
import { query } from "express";

@Controller("operatorProposal")
@ApiTags("operatorProposal")
@UseInterceptors(ClassSerializerInterceptor)
export class WebOperatorProposalController {
  constructor(
    private OperatorProposalService: OperatorProposalService,
    private readonly customResponseService: CustomResponseService
  ) {}

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "get operator proposal by query" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: OperatorProposalDto,
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
  async filterProposal(
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<OperatorProposalDto[]> {
    return await this.OperatorProposalService.searchDetails(params);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: "get operator proposal by id ,providerID and createdBy",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: OperatorProposalDto,
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
  async findAll(
    @Query() params: { operatorId: string; id: string; createdBy: string }
  ): Promise<OperatorProposalDto[]> {
    return await this.OperatorProposalService.find(params);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create operator proposal" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: OperatorProposalDto,
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
  async create(
    @Body() OperatorProposalDto: OperatorProposalDto
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    return await this.OperatorProposalService.create(OperatorProposalDto);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update operatorProposal by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: OperatorProposalDto,
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
  async update(
    @Body() OperatorProposalDto: OperatorProposalDto
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    return await this.OperatorProposalService.update(OperatorProposalDto);
  }

  @Version("1.0")
  @Put("/UpdateDefault")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update operator Proposal by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: OperatorProposalDto,
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
    @Body()
    operatorProposalDto: {
      id: string;
      operatorId: string;
      default: boolean;
    }
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    return await this.OperatorProposalService.UpdateDefault(
      operatorProposalDto
    );
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id" })
  @ApiOperation({ description: "delete operator proposal by id" })
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
  async deleteProvider(@Param("id") id): Promise<string> {
    return await this.OperatorProposalService.delete(id);
  }
}
