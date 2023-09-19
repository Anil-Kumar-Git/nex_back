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
  ApiBody,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse, Role } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { query } from "express";
import { ProviderOperatorService } from "@app/shared/provider-operator/provider-operator.service";
import { providerOperatorDto } from "@app/shared/provider-operator/provider-operator.dto";
import { Status } from "@app/shared/provider-operator/provider-operator.entity";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("providerOperator")
@ApiTags("Provider-Operator Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiProviderOperatorController {
  private readonly type:string;
  constructor(
    private ProviderOperatorService: ProviderOperatorService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type='api'
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of provider-operators for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "typeId",
    description: "providerId or operatorId Parameter",
    type: String,
  })
  @ApiQuery({
    name: "index",
    enum:Role,
    enumName:"index",
    description: "Choose any one Provider Or Operator ",
    required: true,
  })
  @ApiQuery({
    name: "status",
    enum:Status,
    enumName:"status",
    description: "Choose 'Active' for your New Relation and 'InActive' for your Existing Relation",
    required: false,
  })
  @ApiQuery({
    name: "id",
    description: "id Parameter",
    type: String,
    required:false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider/Operator get successfully",

    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "UnauthoCreate any new operator or providerrized",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async findAll(
    @Query()
    params: {
      typeId: string;
      providerId: string;
      operatorId: string;
      id: string;
      createdBy: string;
      index: string;
      status: string;
    }
  ): Promise<providerOperatorDto[]> {
    if(params.index=="Provider"){
    params.providerId=params.typeId;
    }else{
      params.operatorId=params.typeId;
    }
    return await this.ProviderOperatorService.find(params,this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new provider-operator, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
<b>providerId</b>: If you're a Provider, you need to put your company ID here, which you'll get from the getUser API. If you're not a Provider, you can obtain the providerId from the get API of proposal-tracking.<br>
<b>operatorId</b>: If you're an Operator, you need to put your company ID here, which you'll get from the getUser API. If you're not an Operator, you can obtain the operatorId from the get API of proposal-tracking.<br>
<b>refID</b>: The value here will be either 'Internal' or 'Scrapper'. This indicates whether the user with whom your provider-operator is associated is an internal user (from Nexus) or a scrapper (external user, not from Nexus).
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,
  })
  @ApiBody({type:providerOperatorDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider/Operator created successfully",
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
  async create(
    @Body() providerOperatorDto: providerOperatorDto
  ): Promise<providerOperatorDto[]> {
    checkDtoType(providerOperatorDto,"ProOp")
    return await this.ProviderOperatorService.addOperatorById(
      providerOperatorDto,this.type
    );
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any provider-operator, you can do so by providing the ID of that provider-operator along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({type:providerOperatorDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider/Operator updated successfully",

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
  async update(
    @Body() providerOperatorDto: providerOperatorDto
  ): Promise<{status:string,data?:providerOperatorDto,error?:string}> {
    return await this.ProviderOperatorService.update(providerOperatorDto,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your provider-operator ID here to delete the corresponding provider-operator. If you've successfully created a provider-operator, you'll have received a provider-operator ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your provider-operator ID. Once the provider-operator is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider/Operator get successfully",
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
  async deleteProvider(@Param("id") id:string): Promise<string> {
    return await this.ProviderOperatorService.delete(id,this.type);
  }

  // @Version("1.0")
  // @Get("/search")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiOperation({ description: "search any operator or Provider by query" })
  // @ApiQuery({
  //   name: "typeId",
  //   description: "typeId as a ProviderId or OpraterId Parameter",
  //   type: String,
   
  // })
  // @ApiQuery({
  //   name: "type",
  //   enum:Role,
  //   enumName:"type",
  //   description: "Choose any one",
  //   required: true,
  // })
  // @ApiQuery({
  //   name: "status",
  //   enum:Status,
  //   enumName:"status",
  //   description: "Choose any one",
  //   required: true,
  // })
  // @ApiQuery({
  //   name: "query",
  //   description: "query as (refId ,index ) Parameter",
  //   type: String,
  //   required: false,
  // })
  // // @ApiQuery({
  // //   name: "limit",
  // //   description: "limit Parameter",
  // //   type: String,
  // //   required:false
  // // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Provider/Operator get successfully",
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
  // })
  // async SearchByIdOrName(
  //   @Query()
  //   params: {
  //     limit: number;
  //     query: string;
  //     type: string;
  //     typeId: string;
  //   }
  // ): Promise<string[]> {
  //   return await this.ProviderOperatorService.search(params);
  // }
}
