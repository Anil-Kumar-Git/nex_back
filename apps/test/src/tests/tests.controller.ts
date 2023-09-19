import { Controller, UseFilters, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

import { GlobalService } from '@app/shared/core/config/global.service';

import { UsersService } from '@app/shared//users/users.service';

import { UsersDto } from '@app/shared/users/users.dto';

@ApiExcludeController()
@Controller('tests')
export class TestsController {
  constructor(private usersService: UsersService) {}

  @Get('/resetTest')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  resetTest() {
    GlobalService.isTestCase = false;
    console.log('resetTest');
    return 'resetTest';
  }

  @Get('/startTest')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  async startTest() {
    GlobalService.isTestCase = true;

    let adminUser: UsersDto = {
      id: null,
      email: 'lucaggiannone@gmail.com',
      firstname: 'Luca',
      lastname: 'Giannone',
      password: '1234567890',
      mobile: 'mobile',
      whatsapp: 'whatsapp',
      skype: 'skype',
      slack: 'slack',
      telegram: 'telegram',
      signal: 'signal',
      viber: 'viber',
      discord: 'discord',
      profile: 'admin',
    };

    let exists = await this.usersService.getUserByEmail(adminUser.email);
    if (exists == null) await this.usersService.createIntern(adminUser);
    console.log('startTest');
    return 'startTest';
  }
}
