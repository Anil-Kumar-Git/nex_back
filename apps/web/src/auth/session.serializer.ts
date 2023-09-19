import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UsersDto } from '@app/shared/users/users.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: UsersDto,
    done: (err: Error | null, id?: UsersDto) => void,
  ): void {
    done(null, user);
  }

  deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void,
  ): void {
    done(null, payload);
  }
}
