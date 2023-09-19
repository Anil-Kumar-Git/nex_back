import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { UsersModule } from '@app/shared/users/users.module';
import { WebUsersModule } from './../users/web.users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@app/shared/core/config/config.service';
import { ConfigModule } from '@app/shared/core/config/config.module';
import { Providers } from '@app/shared/providers/providers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from '@app/shared/providers/providers.service';
import { Operators } from '@app/shared/operators/operators.entity';
import { OperatorsService } from '@app/shared/operators/operators.service';
 
import { UserProviderOperatorService } from '@app/shared/user-provider-operator/user-provider-operator.service';
import { UserProviderOperator } from '@app/shared/user-provider-operator/user-provider-operator.entity';
import { SandGrid } from '@app/shared/sandgrid/sandgrid.entity';
import { SandgridService } from '@app/shared/sandgrid/sandgrid.service';

@Module({
  imports: [
    UsersModule,
    CustomResponseModule,
    WebUsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([SandGrid,Providers,Operators, UserProviderOperator]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('secretKey'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer,SandgridService, ProvidersService,OperatorsService, UserProviderOperatorService],
})
export class AuthModule { }
