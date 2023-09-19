import { UsersService } from '@app/shared/users/users.service';
import { UsersDto } from '@app/shared/users/users.dto';
import { Users } from '@app/shared/users/users.entity';

export class GlobalService {
  static isTestCase: boolean = false;
  static usersService: UsersService = null;
}
