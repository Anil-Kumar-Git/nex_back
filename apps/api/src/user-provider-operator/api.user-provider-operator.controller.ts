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
  ApiHeader,
  ApiBody,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { query } from "express";
import { UserProviderOperatorService } from "@app/shared/user-provider-operator/user-provider-operator.service";
import { UserProviderOperatorDto } from "@app/shared/user-provider-operator/user-provider-operator.dto";
import { UserApiProviderOperatorCreateDto, UserApiProviderOperatorUpdateDto } from "@app/shared/common/apiDtos";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("user_provider_operator")
@ApiTags("User Provider-Operator Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiUserProviderOperatorController {
  private readonly type:string
  constructor(
    private userProviderOperatorService: UserProviderOperatorService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type='api'
  }

  // @Version("1.0")
  // @Get("/:id")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiOperation({ description: "Kindly input your user-provider-operator ID here to retrieve comprehensive user-provider-operator information. Upon successful user-provider-operator creation, you'll receive your user-provider-operator ID. Alternatively, you can utilize the 'get' APIs for user-provider-operator to obtain your user-provider-operator ID." })
  // @ApiParam({ name: "id", type: String, required: true })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "User (operator or provider) get successfully",
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
  // async findById(@Param("id") id: string): Promise<UserProviderOperatorDto> {
  //   const data=await this.userProviderOperatorService.getUserProviderOperatorById(
  //     id,this.type
  //   );
  //   return data
  // }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of subUsers for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "companyId",
    description: "companyId as a ProviderId or OpraterId Parameter",
    type: String,
    required: true,
  })
  // @ApiQuery({
  //   name: "id",
  //   description: "User (operator or provider) id Parameter",
  //   type: String,
  //   required: false,
  // })
  // @ApiQuery({
  //   name: "userId",
  //   description: "user id Parameter",
  //   type: String,
  //   required: false,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User (operator or provider) get successfully",
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
  async findAll(@Query() params: { companyId: string, id: string, userId: string }): Promise<{ status: string, data?: UserProviderOperatorDto[], error?: string }> {
    return await this.userProviderOperatorService.find(params,this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new subUser, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>companyId</b>: Please put your company ID here, which you'll get from the getUser API. <br>
<b>userId</b>: In this field, you should input your user ID, which you will receive when you create a user.<br>.`,
  })
  @ApiBody({ type: UserApiProviderOperatorCreateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User (operator or provider) created successfully",
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
    @Body() UserProviderOperatorDto: UserProviderOperatorDto
  ): Promise<any> {
    checkDtoType(UserProviderOperatorDto,"UProOp","post")
    return await this.userProviderOperatorService.create(
      UserProviderOperatorDto,this.type
    );
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any user-provider-operator, you can do so by providing the ID of that user-provider-operator along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: UserApiProviderOperatorUpdateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User (operator or provider) updated successfully",
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
    @Body() UserProviderOperatorDto: UserProviderOperatorDto
  ): Promise<UserProviderOperatorDto> {
    checkDtoType(UserProviderOperatorDto,"UProOp","put")
    return await this.userProviderOperatorService.update(
      UserProviderOperatorDto,this.type
    );
  }

  // @Version("1.0")
  // @Delete("/:id")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiParam({ name: "id", type: String, required: true })
  // @ApiOperation({
  //   description: "Please provide your user_provider_operator ID here to delete the corresponding user_provider_operator. If you've successfully created a user_provider_operator, you'll have received a user_provider_operator ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your user_provider_operator ID. Once the user_provider_operator is deleted, their information will be removed from the system.",
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "User (operator or provider) deleted successfully",
  //   type: null,
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
  // async deleteProvider(@Param("id") id): Promise<string> {
  //   return await this.userProviderOperatorService.delete(id,this.type);
  //   return null;
  // }
}
