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
  ApiHeader,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from "@nestjs/swagger";

import { ContactUsDto, ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";
import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";
import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";

import { UsersService } from "@app/shared/users/users.service";
import { ChangePasswordDto, UsersDataDto, UsersDto } from "@app/shared/users/users.dto";
import { Users } from "@app/shared/users/users.entity";

import { AuthUser } from "./api.users.decorator";
import { UsersDeactivateService } from "@app/shared/users/deactvate.user.service";
import { apiUpdateUsersDto } from "@app/shared/common/apiDtos";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("users")
@ApiTags("User Apis")
@ApiSecurity("Api-Key")
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiUsersController {
  private readonly type:string;
  constructor(
    protected usersService: UsersService,
    protected usersDeActivateService: UsersDeactivateService,
    protected readonly customResponseService: CustomResponseService
  ) {
    this.type="api"
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Kindly input your user ID here to retrieve comprehensive user information. Upon successful user creation, you'll receive your user ID. Alternatively, you can utilize the 'get' APIs for providers or operators to obtain your user ID." })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get single user successfully",
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
  async getuserById(@Param("id") id: string): Promise<UsersDto> {
    const data = await this.usersService.getUserById(id,this.type);
    return data;
  }

  @Version("1.0")
  @Get("subUser/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description:"Enter your User ID here to access all sub-users of this user using User ID. On successful user creation, you will receive your User ID. Alternatively, contact your providers or operators to receive your User ID. Use the 'Get' API for." })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all sub-user successfully",
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
  async getAllSubUsers(@Param("id") id: string): Promise<UsersDto> {
    const data = await this.usersService.getAllSubUser(id,this.type);
    return data;
  }

  // @Version('1.0')
  // @Get('/')
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ description: 'Get all users' })
  // // @ApiQuery({
  // //   name: "typeId",
  // //   description: "Enter (ProviderId Or OperaterId)",
  // //   type: String,
  // //   required: true,
  // // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Ok',
  //   type: UsersDto,
  //   isArray: false,
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Bad Request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Unauthorized',
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: 'Internal server error',
  // })
  // async getAlluser(): Promise<UsersDto[]> {
  //   return await this.usersService.getAllUser(this.type);
  // }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: `To create a new users, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>userRole</b>: Here, you should put your userRole (Provider or Operator) .<br>
<b>userType</b>: Here, you should put your userType (Technical User or Commercial User) .<br>`  })
  @ApiBody({ type: UsersDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User created successfully",
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
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "already exist",
  })
  async create(
    @AuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto
  ): Promise<UsersDto> {
    checkDtoType(userDto,"users")
    const data = await this.usersService.create(authUser, userDto,this.type);
      return data;
  }



  @Version('1.0')
  @Post('/changePassword')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Please consult the provided example in the request body to input user details. Adhering to the schema ensures a successful password change. An error response will be issued in case of any errors." })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async changePassword(
    @Body() userDto: ChangePasswordDto,
  ): Promise<{ status: string, data?: UsersDto, error?: string }> {
    let type="api"
    return await this.usersService.changePassword(userDto,this.type);
  }

  // @Version('1.0')
  // @Post('/contactUs')
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ description: "Kindly refer to the provided example in the request body for entering user details. Our team will address your query. Thank you for your messages. In case of any errors, an error response will be provided." })
  // @ApiBody({ type: ContactUsDto })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Ok'
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Bad Request'
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Unauthorized'
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: 'Internal server error',
  //   type: ErrorResponse,
  // })
  // async contactUs(@Body() bodyData:{senderEmail:string,message:string,firstName:string,lastName?:string,companyName:string,businessType:string}): Promise<{status:string,data?:string,error?:string}> {
  //   return await this.usersService.contactUs(bodyData,this.type);
  // }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any user, you can do so by providing the ID of that user along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })  @ApiBody({ type: apiUpdateUsersDto ,description:"Note : For updates, please note that the email and userRole cannot be modified." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
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
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "conflicts",
  })
  async update(
    @AuthUser() authUser: UsersDto,
    @Body() userDto: UsersDto,
      ): Promise<{ status: string; data?: UsersDto | any; error?: string }> {
    const data = await this.usersService.update(userDto,authUser,this.type);
    return data;
  }

  // @Version("1.0")
  // @Delete("/:id")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiParam({ name: "id", type: String, required: true })
  // @ApiOperation({ description: "Please provide your user ID here to delete the corresponding user. If you've successfully created a user, you'll have received a user ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your user ID. Once the user is deleted, their information will be removed from the system." })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "User deleted successfully",
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
  // async deleteUser(
  //   @Param("id") id: string
  // ): Promise<{ status: string; data?: string; error?: string }> {
  //   return await this.usersService.delete(id,this.type);
  // }

  // @Version('1.0')
  // @Delete('/deActivate/:id')
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiParam({ name: "id", type: String, required: true })
  // @ApiOperation({ description: "De-Activated any user by id" })
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "User de-Active successfully",
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
  // async deActivateUser(
  //   @Param('id') id: string,
  // ) : Promise<{ status: string, data?: string, message?: string }>
  //  {
  //   return await this.usersDeActivateService.setDeactvateDate(id,this.type);
  // }

  @Version('1.0')
  @Delete('/deleteSubUser/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide the sub-user ID here for deletion, along with the user ID. You will have obtained the subuser ID from the sub-user 'get' API. Deleting the sub-user using their respective ID will remove their information from the system." })
  @ApiQuery({
    name: "userId",
    description: "Enter userId",
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',

  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',

  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async deleteSubUser(@Param('id') id: string,@Query('userId') userId: string): Promise<{ status: string, data?: string, error?: string }> {
    return await this.usersService.deleteSubUser(id,userId,this.type);
    
  }
}
