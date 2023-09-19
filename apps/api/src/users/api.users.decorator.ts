import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Users } from '@app/shared/users/users.entity';

export const AuthUser = createParamDecorator(
  (data: keyof Users, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as Users;

    return data ? user && user[data] : user;
  },
);
