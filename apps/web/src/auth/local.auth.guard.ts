import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { UsersDto } from "@app/shared/users/users.dto";
import { OperatorsService } from "@app/shared/operators/operators.service";
import { UsersService } from "@app/shared/users/users.service";
import { Users } from "@app/shared/users/users.entity";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  constructor(
    private readonly userServices: UsersService,
    private readonly reflector: Reflector
  ) {
    super();
  }

  @Timeout(10000)
  handleDtoCron(user:Users) {
    if (user) {
      setTimeout(()=>{
        const updata = {
          id: user?.id,
          profileCompleted: true,
        };
        const upduser = Object.assign(new UsersDto(), updata);
        this.userServices.update(null, upduser);
      },3600000)
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    if (context.getType() === "http") {
      const request = context.switchToHttp().getRequest();
      if(request.user.initialUser && !request.user.profileCompleted){
        this.handleDtoCron(request.user);
      }
      await super.logIn(request);
    }

    return result;
  }
}
