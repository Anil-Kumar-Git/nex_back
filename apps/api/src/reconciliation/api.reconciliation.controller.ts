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
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ErrorResponse, Role } from '@app/shared/common/interfaces/errorResponse.interface';
import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';
import { ReconciliationService } from '@app/shared/reconciliation/reconciliation.service';
import { ReconciliationDto } from '@app/shared/reconciliation/reconciliation.dto';
import { checkDtoType } from '@app/shared/common/errorHandling';


@Controller('reconciliation')
@ApiTags('Reconciliation Apis')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiReconciliationController {
  private readonly type:string; 
  constructor(
    private ReconciliationService: ReconciliationService,

  ) {
    this.type="api"
   }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of reconciliation for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
    @ApiQuery({
    name: "typeId",
    description: "Enter operatorId or  providerId  for reconcilation file",
    type: String,
  })
  @ApiQuery({ name: "index", enum: Role,
  enumName: 'index', description: "type query parameter"})
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
  async findAll(@Query() params: { id: string, operatorId: string, providerId: string, createdBy: string,index?:string,typeId?:string }): Promise<ReconciliationDto[]> {
   if(params.index=="Operator"){
    params.operatorId=params.typeId
   }else{
    params.providerId=params.typeId
   }
    return await this.ReconciliationService.getReconciliation(params,this.type);
  }

  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "Kindly input your reconciliation ID here to retrieve comprehensive reconciliation information. Upon successful reconciliation creation, you'll receive your reconciliation ID. Alternatively, you can utilize the 'get' APIs for reconciliation to obtain your reconciliation ID." })
  @ApiParam({ name: "id", type: String, required: true })
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
  async findById(@Param('id') id: string): Promise<ReconciliationDto[]> {
    return await this.ReconciliationService.getReconciliation({ id: id },this.type);
  }


  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new reconcilliations, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
<b>providerId</b>: If you're a Provider, you need to put your company ID here, which you'll get from the getUser API. If you're not a Provider, you can obtain the providerId from the get API of proposal-tracking.<br>
<b>operatorId</b>: If you're an Operator, you need to put your company ID here, which you'll get from the getUser API. If you're not an Operator, you can obtain the operatorId from the get API of proposal-tracking.<br>
<b>refIndex</b>: The value here will be either 'Internal' or 'Scrapper'. This indicates whether the user with whom your reconcilliations is associated is an internal user (from Nexus) or a scrapper (external user, not from Nexus).<br>
<b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,
  })
  @ApiBody({type:ReconciliationDto , description: "Request body description: We only accept default as 'true' and 'false' in boolean.<br> <b>Note</b>: If the type of the default value is not boolean, it will default to false."})
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
  async create(@Body() ReconciliationDto: ReconciliationDto): Promise<ReconciliationDto> {
    checkDtoType(ReconciliationDto,"reco")
    return await this.ReconciliationService.create(ReconciliationDto,this.type);
  }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your reconciliation ID here to delete the corresponding reconciliation. If you've successfully created a reconciliation, you'll have received a reconciliation ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your reconciliation ID. Once the reconciliation is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: null,
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
  async deleteProvider(@Param('id') id): Promise<string> {
    return await this.ReconciliationService.delete(id,this.type);
  }

}
