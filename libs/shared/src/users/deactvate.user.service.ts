import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";

import { OperatorsService } from "../operators/operators.service";
import { ProvidersService } from "../providers/providers.service";

import { ChangePasswordDto, UsersDto, UserWithCompnay } from "./users.dto";
import { Users } from "./users.entity";

import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";

import { v4 as uuidv4 } from "uuid";

import { GlobalService } from "../core/config/global.service";
import { SandgridService } from "../sandgrid/sandgrid.service";
import { UserProviderOperator } from "../user-provider-operator/user-provider-operator.entity";
import { UsersService } from "./users.service";
import { Games } from "../games/games.entity";
import { ProposalTracking } from "../proposalTracking/proposal_tracking.entity";
import { ProviderOperator } from "../provider-operator/provider-operator.entity";
import { ProviderProposal } from "../providerProposal/providerProposal.entity";
import { Providers } from "../providers/providers.entity";
import { GameTracking } from "../gameTracking/game_tracking.entity";
import { Contracts } from "../contracts/contracts.entity";
import { Operators } from "../operators/operators.entity";
import { OperatorProposal } from "../operatorProposal/operatorProposal.entity";
import { updateEmailSubscription } from "../common/interfaces/errorResponse.interface";
import { externalProviderOpeartors } from "../externalProviderOperator/externalProviderOperator.entity";

@Injectable()
export class UsersDeactivateService {
  constructor(
    private readonly sandgridService: SandgridService,

    @InjectRepository(Users)
    private readonly users_repo: Repository<Users>,
    @InjectRepository(Games)
    private readonly game_repo: Repository<Games>,
    @InjectRepository(ProposalTracking)
    private readonly proposal_Tr_repo: Repository<ProposalTracking>,
    @InjectRepository(ProviderOperator)
    private readonly provider_Op_repo: Repository<ProviderOperator>,
    @InjectRepository(UserProviderOperator)
    private readonly userpro_Op_repo: Repository<UserProviderOperator>,
    @InjectRepository(ProviderProposal)
    private readonly provider_Pro_repo: Repository<ProviderProposal>,
    @InjectRepository(Providers)
    private readonly provider_repo: Repository<Providers>,
    @InjectRepository(GameTracking)
    private readonly game_Tr_repo: Repository<GameTracking>,
    @InjectRepository(Contracts)
    private readonly contract_repo: Repository<Contracts>,
    @InjectRepository(Operators)
    private readonly operator_repo: Repository<Operators>,
    @InjectRepository(OperatorProposal)
    private readonly operator_Pro_repo: Repository<OperatorProposal>,
    @InjectRepository(externalProviderOpeartors)
    private readonly external_op_Pro_repo: Repository<externalProviderOpeartors>,

    private readonly user_service: UsersService
  ) { }

  async setDeactvateDate(id: string,type?:string) {
    try {
      const user = await this.users_repo.findOneBy({ id });
      if (!user) {
        return { status: "error", message: "No record found with the ID" };
      }
      user.deactivationDate = new Date();
      await this.users_repo.update(id, user);
      // const save = await this.user_service.getUserById(user.id);
      // console.log(save.deactivationDate, "setDeactvate");
      return {
        status: "success",
        message: `${user.firstname} account de-activate successfully`,
      };
    } catch (error) {
      return { status: "error", message: error };
    }
  }

  async getEmailSubscription(id:string,apitype:string,role?:string): Promise<any> {
    try {
      let type;
      if (apitype == "Internal") {
        if (role == "Operator") {
          type = "interPro";
        } else {
          type = "interOp";
        }
      } else {
        type = "interExt";
      }
      let res;
    if(type=="interOp"){
      res= await this.operator_repo.findOneBy({id});
    }else if(type=="interExt"){
      res= await this.external_op_Pro_repo.findOneBy({id});
    }else if(type=="interPro"){
      res= await this.provider_repo.findOneBy({id});
    }
       return res.emailSubscription;
    } catch (error) {
      console.log(error, "usersForDeActiveusers--error");
      return false
    }
  }

  async updateEmailSubscription(details:updateEmailSubscription): Promise<any> {
    try {
      let res;
      console.log(details,"details")
      const forUpdate={emailSubscription:details.emailSubscription}
    if(details.apiType=="interOp"){
      res= await this.operator_repo.update(details.id, forUpdate);
    }else if(details.apiType=="interExt"){
      res= await this.external_op_Pro_repo.update(details.id, forUpdate);
    }else if(details.apiType=="interPro"){
      res= await this.provider_repo.update(details.id, forUpdate);
    }

    if(res.affected!=0){
      return {
        status: "success",
        message: `Email Subscription is canceled successfully`,
      };
    }
    return {
      status: "error",
      message: `Error try after sometime`,
    };
    } catch (error) {

      console.log(error, "usersForDeActiveusers--error");
      return {
        status: "error",
        message: `Error try after sometime`,
      };
    }
  }

  async getUsersToDeactivate(): Promise<UsersDto[]> {
    try {
      const currentDate = new Date();
      const users = await this.users_repo.find();

      const usersForDeActive = users.filter((user) => {
        if (user.deactivationDate !== null) {
          user.deactivationDate <= currentDate;
        }
      });
      return usersForDeActive;
    } catch (error) {
      console.log(error, "usersForDeActiveusers--error");
    }
  }

  async runDeleteQuery(id: string) {
    const repoKeys = [
      { key: "game_Tr_repo", value: this.game_Tr_repo },
      { key: "proposal_Tr_repo", value: this.proposal_Tr_repo },
      { key: "game_repo", value: this.game_repo },
      { key: "provider_Op_repo", value: this.provider_Op_repo },
      { key: "provider_repo", value: this.provider_repo },
      { key: "provider_Pro_repo", value: this.provider_Pro_repo },
      { key: "contract_repo", value: this.contract_repo },
      { key: "operator_repo", value: this.operator_repo },
      { key: "operator_Pro_repo", value: this.operator_Pro_repo },
      { key: "users_repo", value: this.users_repo },
      { key: "userpro_Op_repo", value: this.userpro_Op_repo },
    ];

    const result = [];
    await Promise.all(
      repoKeys.map(async (item) => {
        let checkId =
          item.key === "users_repo"
            ? "id"
            : item.key === "userpro_Op_repo"
              ? "userIdId"
              : "createdById";
        const queryResult = await item.value
          .createQueryBuilder(`${item.key}`)
          .delete()
          .where(`${checkId} = :id`, {
            id: id,
          })
          .execute();
        result.push({ [item.key]: queryResult });
      })
    );
    return result;
  }

  async ContractDeleteQuery(id: string) {
    const repoKeys = [
      { key: "game_Tr_repo", value: this.game_Tr_repo },
      // { key: "proposal_Tr_repo", value: this.proposal_Tr_repo },
      // { key: "game_repo", value: this.game_repo },
      // { key: "provider_Op_repo", value: this.provider_Op_repo },
      // { key: "provider_repo", value: this.provider_repo },
      // { key: "provider_Pro_repo", value: this.provider_Pro_repo },
      { key: "contract_repo", value: this.contract_repo },
      // { key: "operator_repo", value: this.operator_repo },
      // { key: "operator_Pro_repo", value: this.operator_Pro_repo },
      // { key: "users_repo", value: this.users_repo },
      // { key: "userpro_Op_repo", value: this.userpro_Op_repo },
    ];

    const result = [];
    await Promise.all(
      repoKeys.map(async (item) => {
        let checkId =
          item.key === "contract_repo"
            ? "id"
            : "contractIdId";
        const queryResult = await item.value
          .createQueryBuilder(`${item.key}`)
          .delete()
          .where(`${checkId} = :id`, {
            id: id,
          })
          .execute();
        result.push({ [item.key]: queryResult });
      })
    );
    return result;
  }
  async deActivateUser(id: string) {
    try {
      const user = await this.users_repo.findOneBy({ id });
      if (!user) {
        return { status: "error", error: "No record found with the ID" };
      }
      const data = await this.runDeleteQuery(user?.id);
      console.log(data, "dataDeleted");
    } catch (error) {
      console.log(error, "error");
    }
  }
}
