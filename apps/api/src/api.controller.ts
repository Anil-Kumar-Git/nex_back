import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags("Nexus-7995")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  @ApiOperation({ description: "This endpoint is intended for testing purposes. If all APIs are functioning properly, it will return 'Nexus7995!'. If there's an issue with any of the APIs, it will return an error." })
  getIndex(): string {
    return this.service.getIndex();
  }
}
