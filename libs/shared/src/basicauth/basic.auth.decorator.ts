import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { UsersDto } from './../users/users.dto';
import { UsersService } from './../users/users.service';
import { GlobalService } from './../core/config/global.service';

export const BasicAuthUser = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    if (!ctx.switchToHttp) {
      return null;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    let auth = req.headers['Authorization'];
    if (auth == null) auth = req.headers['authorization'];
    if (auth == null) return null;

    auth = auth + '';
    auth = auth.split(' ')[1];
    auth = Buffer.from(auth, 'base64').toString();

    const username = auth.split(':')[0];

    var user = await GlobalService.usersService.getUserByEmail(username);
    return user;
  },
);
