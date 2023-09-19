import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from './auth.service';
import { UsersDto } from '@app/shared/users/users.dto';
import { JwtPayload } from './jwt.payload.interface';

import { ConfigService } from '@app/shared/core/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('secretKey'),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): Promise<UsersDto> {    
    if (!payload) {
      // Handle the case where payload is undefined or null
      throw new Error('Invalid payload');
    }
  
    return this.authService.verifyPayload(payload);
  }
}
