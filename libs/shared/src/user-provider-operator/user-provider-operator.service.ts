import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult, Like } from "typeorm";

import { UserProviderOperatorDto } from "./user-provider-operator.dto";
import { UserProviderOperator } from "./user-provider-operator.entity";

import { UsersDto } from "../users/users.dto";
import { Users } from "../users/users.entity";

import { ValidateService } from "../core/config/validate.service";

import { v4 as uuidv4 } from "uuid";
import { Providers } from "../providers/providers.entity";
import { error } from "console";
import { SandgridService } from "../sandgrid/sandgrid.service";
import {  handleErrors } from "../common/errorHandling";
@Injectable()
export class UserProviderOperatorService {
  constructor(
    private readonly sandgridService: SandgridService,
    @InjectRepository(UserProviderOperator)
    private readonly repository: Repository<UserProviderOperator>
  ) {}

  async create(
    userProviderOperator: UserProviderOperatorDto,type?:string
  ): Promise<UserProviderOperatorDto> {
    try {
      userProviderOperator.id = uuidv4();
      let operator_proposal =
        this.getUserProviderOperatorAsEntity(userProviderOperator);

      let saved = await this.repository.save(operator_proposal);
      return this.getUserProviderOperatorAsDto(saved);
    } catch (error) {
      if(type=="api"){
        handleErrors(error)
      }
      if (error.code === "ER_DUP_ENTRY") {
        const duplicateKey = error.sqlMessage.split("'")[1];
        const errorMessage = `Error: The ${duplicateKey} already exists.`;
        throw new HttpException(errorMessage, HttpStatus.CONFLICT, {
          cause: new Error(errorMessage),
        });
      }

      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error(error?.sqlMessage),
        });
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error(error),
      });
    }
  }
  async find(params: {
    companyId?: string;
    id?: string;
    userId?: string;
  }, type?:string): Promise<{
    status: string;
    data?: UserProviderOperatorDto[];
    error?: string;
  }> {
    try {
            let saved = await this.repository.find({
        where: {
          id: params.id,
          userId: { id: params.userId },
          companyId: params.companyId,
        },
        relations: {
          userId: true,
        },
      });
      console.log(type)
      if (saved.length<=0 && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
      const user = this.getUserProviderOperatorsAsDto(saved);
      return { status: "success", data: user };
    } catch (error) {
      if(type=="api"){
        handleErrors(error);
      }
      return { status: "error", error: error };
    }
  }

  async getUserProviderOperatorById(
    id: string ,type?:string
  ): Promise<UserProviderOperatorDto> {
    try {
      let res = await this.repository.findOne({ where: { id: id } });
      if (res == null && type == "api") {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST
        );
      }
    
      return this.getUserProviderOperatorAsDto(res);
    } catch (error) {
      if(type=="api"){
        handleErrors(error);
      }
      return error;
    }
  }

  async update(
    UserProviderOperatorDto: UserProviderOperatorDto,type?:string
  ): Promise<UserProviderOperatorDto> {
    try {
      const provider_proposal_entity = this.getUserProviderOperatorAsEntity(
        UserProviderOperatorDto
      );
      delete UserProviderOperator["version"];
      let updateResult = await this.repository.update(
        UserProviderOperatorDto.id,
        provider_proposal_entity
      );
      if (updateResult.affected === 0) {
        throw new HttpException(
          "No record found with the ID",
          HttpStatus.BAD_REQUEST,
          { cause: new Error("No record found with the ID") }
        );
      }
      let res = await this.repository.find({
        where: { id: UserProviderOperatorDto.id },
        relations: {
          userId: true,
        },
      });

      return this.getUserProviderOperatorAsDto(res[0]);
    } catch (error) {
      if(type=="api"){
        handleErrors(error);
      }
      return error;
    }
  }
  async delete(id: string,type?:string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        if(type=="api"){
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.BAD_REQUEST
          );
        }
        // If no rows were affected, it means the ID does not match any existing records
        return "error: ID does not exist";
      }
      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      if(type=="api"){
          handleErrors(error)
      }
      // Handle specific error cases
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        // If the error is due to a foreign key constraint violation
        return "error: The record cannot be deleted because it is referenced by other records";
      }
      // Handle other general errors
      return "error: An error occurred while deleting the record";
    }
  }
  //some common function
 
  getUserProviderOperatorAsEntity(
    userProviderOperator: UserProviderOperatorDto
  ): UserProviderOperator {
    if (userProviderOperator == null) return null;
    let operator_proposal: UserProviderOperator = Object.assign(
      new UserProviderOperator(),
      userProviderOperator
    );

    operator_proposal.userId = Object.assign(
      new Users(),
      userProviderOperator.userId
    );

    return operator_proposal;
  }

  getUserProviderOperatorsAsDto(
    items: UserProviderOperator[]
  ): Array<UserProviderOperatorDto> {
    if (items == null) return null;
    let ret = new Array<UserProviderOperatorDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getUserProviderOperatorAsDto(items[i]));
    }
    return ret;
  }
  getUserProviderOperatorAsDto(
    item: UserProviderOperator
  ): UserProviderOperatorDto {
    if (item == null) return null;
    let ret: UserProviderOperatorDto = Object.assign(
      new UserProviderOperatorDto(),
      item
    );

    ret.userId = Object.assign(new Users(), item.userId);

    return ret;
  }
}
