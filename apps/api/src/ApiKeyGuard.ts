import { adminUrl, operatorUrl, providerUrl } from "@app/shared/common/option";
import { Users } from "@app/shared/users/users.entity";
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Users)
    private readonly users_repo: Repository<Users>
  ) {}

  getUserAccess(id: string, path: string, method: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.users_repo.findOne({
          where: { id: id },
        });

        const runUrl =
          user.userRole === "Provider"
            ? providerUrl
            : user.userRole === "Operator"
            ? operatorUrl
            : adminUrl;
        for (const item of runUrl) {
          if (path.includes(item.url) && item.method === "no") {
            resolve(`The ${user.userRole} cannot access this API endpoint.`);
            return;
          } else if (
            path.includes(item.url) &&
            item.method === "read" &&
            method !== "get"
          ) {
            resolve(
              `${user.userRole} users can only have read access on the ${item.url} APIs.`
            );
            return;
          }
        }

        resolve("ok");
      } catch (error) {
        reject(error);
      }
    });
  }

  ///

  getUserApiKey(
    id: string,
    key?: string,
    path?: string,
    method?: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key || !id) {
          resolve("User Id and User Key is Required.");
          return;
        }
        const user = await this.users_repo.findOne({
          where: { id: id },
        });

        if (!user) {
          resolve("User not found with this ID.");
          return;
        } else if (!user.apiKey) {
          resolve("User is not allowed to access these APIs.");
          return;
        } else if (user.apiKey !== key) {
          resolve("Invalid API key for this user.");
          return;
        } else {
          const accessMessage = await this.getUserAccess(id, path, method);
          resolve(accessMessage);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const method = Object.keys(request.route.methods);
    const apiKey = request.headers["api-key"];
    const apiId = request.headers["user-id"];
    if(path.includes("users") && (method[0]=="post"|| method[0]=="get") && !path.includes("subUser")){
      return true;
    }

    const promises = [this.getUserApiKey(apiId, apiKey, path, method[0])];
    const message = await Promise.all(promises);
    if (message[0] == "ok") {
      return true;
    } else {
      throw new UnauthorizedException(message[0]);
    }
  }
}
