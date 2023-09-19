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
  UploadedFile,
  UseInterceptors,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse, Role, ContractDtoDefault, ContractDtoStatus  } from "@app/shared/common/interfaces/errorResponse.interface";

import { ContractsService } from "@app/shared/contracts/contracts.service";
import { ContractsDto } from "@app/shared/contracts/contracts.dto";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { apiUpdateContractsDto } from "@app/shared/common/apiDtos";
import { checkDtoType } from "@app/shared/common/errorHandling";


@Controller("contracts")
@ApiTags("Contract Apis")
// @ApiHeader({
//   name: "X-API-Key",
//   description: "API key for authentication",
//   required: true,
// })
@ApiSecurity("Api-Key")
@ApiSecurity("basic")
export class ApiContractsController {
  private readonly type: string;
  constructor(
    private contractsService: ContractsService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type = "api";
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File ,@Req() req: Request) {
  //   const imageURL =`${req.protocol}://${req.get('Host')}/${file.path}`
  //   return {url: imageURL}
  // }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "Kindly input your contract ID here to retrieve comprehensive contract information. Upon successful contract creation, you'll receive your contract ID. Alternatively, you can utilize the 'get' APIs for contract to obtain your contract ID.",
  })
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
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "To retrieve the list of contracts for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator).",
  })
  @ApiQuery({
    name: "index",
    enum: Role,
    enumName: "typeOptions",
    description: "Choose any one",
    required: true,
  })
  @ApiQuery({
    name: "typeId",
    description: "Enter (ProviderId Or OperaterId)",
    type: String,
    required: true,
  })
  // @ApiQuery({
  //   name: "createdBy",
  //   description: "Enter user id who create this Contract",
  //   type: String,
  //   required: false,
  // })
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
      typeId?: string;
      status: string;
      index: string;
    }
  ): Promise<ContractsDto[]> {
    if (params.typeId) {
      if (params.index === "Operator") {
        params.operatorId = params.typeId;
      } else {
        params.providerId = params.typeId;
      }
    }
    return await this.contractsService.findByDetails(params, this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new contract, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
<b>providerId</b>: If you're a Provider, you need to put your company ID here, which you'll get from the getUser API. If you're not a Provider, you can obtain the providerId from the get API of proposal-tracking.<br>
<b>operatorId</b>: If you're an Operator, you need to put your company ID here, which you'll get from the getUser API. If you're not an Operator, you can obtain the operatorId from the get API of proposal-tracking.<br>
<b>refIndex</b>: The value here will be either 'Internal' or 'Scrapper'. This indicates whether the user with whom your contract is associated is an internal user (from Nexus) or a scrapper (external user, not from Nexus).
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,})
  @ApiBody({ type: ContractsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Contract create successfully",
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
  })
  async create(@Body() contractsDto: ContractsDto): Promise<ContractsDto> {
    checkDtoType(contractsDto,"contracts")
    return await this.contractsService.createOneContract(contractsDto, this.type);
  }

  @Version("v1.0")
  @Get("/search/data")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "To search for any contract, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole.",
  })
  @ApiQuery({
    name: "status",
    description: "status= (Draft, Transmitted, Published) parameter",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "query",
    description: "query (id ,contractName ,revShareTiedToGameType) parameter",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "typeId",
    description: "typeId (providerId Or operatorId) query parameter",
    type: String,
  })
  @ApiQuery({
    name: "type",
    enum: Role,
    enumName: "typeOptions",
    description: "type query parameter",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All contracts get successfully",
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
  async findSearch(
    @Query()
    params: {
      query?: string;
      typeId?: string;
      type: string;
      status: string;
    }
  ): Promise<ContractsDto[]> {
    return await this.contractsService.searchDetails(params);
  }

  @Version("")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any contract, you can do so by providing the ID of that contract along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: apiUpdateContractsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Contract update successfully",
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
  async update(
    @Body() contractDto: ContractsDto
  ): Promise<{ status: string; data?: ContractsDto; error?: string }> {
    contractDto.status = "Draft";
    return await this.contractsService.update(contractDto, "", this.type);
  }

  @Version("1.0")
  @Put("/changeStatus")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: ContractDtoStatus,
    description:
      "Request body description: We only accept status as 'draft' and 'published'.",
  })
  @ApiOperation({
    description:
      "To change the status of this contract, you need to send the contract ID and the desired status ('Draft' or 'Published') in the request body.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
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
  })
  async ChangeContractStatus(
    @Body() contractDto: ContractsDto
  ): Promise<{ status: String; data?: ContractsDto; error?: string }> {
    return await this.contractsService.ChangeContractStatus(
      contractDto,
      this.type
    );
  }

  // @Version("1.0")
  // @Put("/updateDefault")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   description:
  //     `If you wish to set any contract as the default, you should send the contract ID and set "default" to true in the request body. The format for "default" should always be a boolean.`,
  // })
  // @ApiBody({
  //   type: ContractDtoDefault,
  //   description:
  //     "Request body description: We only accept default as 'true' and 'false' in boolean.<br> <b>Note</b>: If the type of the default value is not boolean, it will default to false.",
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Set default contract successfully",
  //   isArray: false,
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: "Bad Request",
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: "Unauthorized",
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: "Internal server error",
  //   type: ErrorResponse,
  // })
  // async UpdateDefault(
  //   @Body() contractDto: { id: string; providerId: string; default: boolean }
  // ): Promise<ContractsDto> {
  //   return await this.contractsService.UpdateDefault(contractDto, this.type);
  // }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({
    description:
      "Please provide your contract ID here to delete the corresponding contract. If you've successfully created a contract, you'll have received a contract ID. Alternatively, you can use the 'get' APIs for contract to acquire your contract ID. Once the contract is deleted, their information will be removed from the system.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete contract successfully",
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
  async deleteContract(@Param("id") id: string): Promise<string> {
    return await this.contractsService.delete(id, this.type);
  }
}
