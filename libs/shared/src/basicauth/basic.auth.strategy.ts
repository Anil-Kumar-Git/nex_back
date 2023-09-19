import Strategy from 'passport-headerapikey';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@app/shared/users/users.service';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {
    super(
      { header: 'Authorization', prefix: '' },
      true,
      async (apiKey, done) => {
        return await this.validate(apiKey, done);
      },
    );
  }

  async validate(apiKey: string, done: (error: Error, data) => {}) {
    apiKey = apiKey.split(' ')[1];
    apiKey = Buffer.from(apiKey, 'base64').toString();

    var username = apiKey.split(':')[0];
    var password = apiKey.split(':')[1];

    var valid = await this.usersService.validate(username, password);

    if (valid) {
      done(null, true);
    }

    done(new UnauthorizedException(), null);
  }
}
